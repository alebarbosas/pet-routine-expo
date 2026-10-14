// ============================================================
// Prática 3 — Tela de registro de passeio (sensores)
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Captura o CONTEXTO do passeio: onde aconteceu (GPS) e como ele
// se parecia (câmera). Navegação por condicional com useState —
// navegação real chega na Aula 7.
//
// CONTRATO DE TRÊS TEMPOS (detalhado em cada bloco de sensor abaixo):
//   Localização
//     1. PEDIR   → hasServicesEnabledAsync() + requestForegroundPermissionsAsync()
//     2. LER     → getCurrentPositionAsync(), UMA leitura
//     3. PARAR   → não se aplica: leitura única, nenhuma assinatura aberta
//   Câmera
//     1. PEDIR   → useCameraPermissions() / pedirPermissaoCamera()
//     2. LER     → takePictureAsync() na CameraView
//     3. PARAR   → setMostrarCamera(false) desmonta a CameraView e libera a câmera
//
// Restrições:
//   • Sem useEffect, useRef — apenas useState + hooks das bibliotecas
//   • Sem navegação — a tela aparece por condicional em App.tsx
//   • Sem mapa — coordenada é texto
//   • Sem salvar na galeria e sem escolher do rolo
//   • Sem rede — foto vive no cache
//
// Limitação assumida: não há assinatura (addListener/watchPositionAsync) nesta
// tela. Se houvesse, ela NÃO seria encerrada ao sair da tela, porque a
// ferramenta para isso (useEffect com cleanup) é assunto da Aula 6.
// ============================================================
import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
// Atenção ao import: `Image` vem do expo-image, NÃO do react-native.
import { Image } from 'expo-image';
import * as Location from 'expo-location';
import { CameraView, useCameraPermissions } from 'expo-camera';

import type { Pet } from '../types/pet';
import { formatarLocal } from '../lib/formatar';
import { cores, espaco, layout, tipografia, toque } from '../theme';

type TelaRegistroProps = {
  pet: Pet;
  onSalvar: (local?: Pet['local'], fotoUri?: string) => void;
  onCancelar: () => void;
};

// P3.21 — cada cenário de falha tem a SUA mensagem, e todas dizem o que fazer.
const MENSAGENS = {
  localizacaoNegada:
    'Permissão de localização negada. Toque em "Obter localização" para tentar de novo e escolha "Permitir".',
  localizacaoBloqueada:
    'Permissão de localização bloqueada. O sistema não vai perguntar de novo: abra as configurações do app e ative a localização.',
  servicoDesligado:
    'O GPS do aparelho está desligado. Ative a localização nas configurações do sistema e tente de novo.',
  cameraNegada:
    'Permissão de câmera negada. Toque em "Tirar foto" para tentar de novo e escolha "Permitir".',
  cameraBloqueada:
    'Permissão de câmera bloqueada. O sistema não vai perguntar de novo: abra as configurações do app e ative a câmera.',
  gpsIndisponivel:
    'Não foi possível ler a posição (sensor indisponível ou sem sinal). Vá para um local aberto e tente de novo; você também pode salvar sem localização.',
  cameraIndisponivel:
    'A câmera não está disponível neste aparelho (emuladores e simuladores costumam não ter). Você pode salvar o registro sem foto.',
} as const;

export function TelaRegistro({ pet, onSalvar, onCancelar }: TelaRegistroProps) {
  const [local, setLocal] = useState<Pet['local'] | null>(null);
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [erro, setErro] = useState('');
  // `true` quando só as configurações do sistema resolvem (permissão bloqueada).
  const [erroBloqueado, setErroBloqueado] = useState(false);
  const [mostrarCamera, setMostrarCamera] = useState(false);
  const [cameraPronta, setCameraPronta] = useState(false);
  const [buscandoLocal, setBuscandoLocal] = useState(false);

  // Hook de permissão da lib (permitido; useEffect/useRef não).
  const [permissaoCamera, pedirPermissaoCamera] = useCameraPermissions();

  // Ref da câmera via useState: o `ref` do JSX aceita função (callback ref),
  // então <CameraView ref={setCameraRef} /> guarda a instância no estado.
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);

  function falhar(mensagem: string, bloqueado = false) {
    setErro(mensagem);
    setErroBloqueado(bloqueado);
  }

  function limparErro() {
    setErro('');
    setErroBloqueado(false);
  }

  // ----- Localização -----
  // CONTRATO: 1. PEDIR → serviço ligado? depois requestForegroundPermissionsAsync()
  //           2. LER   → getCurrentPositionAsync() — uma única leitura
  //           3. PARAR → não se aplica: sem watchPositionAsync, nada fica aberto
  async function obterLocalizacao() {
    if (buscandoLocal) return;
    setBuscandoLocal(true);
    try {
      // Cenário 3: serviço de localização desligado.
      const servicoLigado = await Location.hasServicesEnabledAsync();
      if (!servicoLigado) {
        falhar(MENSAGENS.servicoDesligado);
        return;
      }

      // Cenários 1 e 2: negada (dá para perguntar de novo) vs. bloqueada (não dá).
      const permissao = await Location.requestForegroundPermissionsAsync();
      if (!permissao.granted) {
        if (permissao.canAskAgain) {
          falhar(MENSAGENS.localizacaoNegada);
        } else {
          falhar(MENSAGENS.localizacaoBloqueada, true);
        }
        return;
      }

      // P3.22 — Accuracy.High (~10 m, usa GPS). Motivo: o registro mostra "±Nm" e
      // o dono quer saber em que rua/trecho foi o passeio; Balanced (~100 m) pode
      // errar o quarteirão. Não usamos BestForNavigation/Highest porque eles
      // mantêm o chip de GPS no máximo para navegação passo a passo — custo de
      // bateria sem ganho aqui. Como é UMA leitura (não um watch), o gasto de
      // bateria do High é de poucos segundos.
      const posicao = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocal({
        latitude: posicao.coords.latitude,
        longitude: posicao.coords.longitude,
        // `accuracy` pode ser null: sem raio informado, 0 faz o texto mostrar "±0m".
        // Aceitável para o mock; em produção vale mostrar "precisão desconhecida".
        precisaoMetros: posicao.coords.accuracy ?? 0,
      });
      limparErro();
    } catch {
      // Cenário 5 (parte GPS): hardware indisponível, timeout, sem sinal.
      falhar(MENSAGENS.gpsIndisponivel);
    } finally {
      setBuscandoLocal(false);
    }
  }

  // ----- Câmera -----
  // CONTRATO: 1. PEDIR → pedirPermissaoCamera()
  //           2. LER   → cameraRef.takePictureAsync()
  //           3. PARAR → setMostrarCamera(false) (desmonta a view e libera a câmera)
  async function abrirCamera() {
    // Cenário 5 (parte câmera): sem hardware (ex.: simulador de iOS).
    const disponivel = await CameraView.isAvailableAsync();
    if (!disponivel) {
      falhar(MENSAGENS.cameraIndisponivel);
      return;
    }

    // Se a permissão já foi concedida antes, não pergunta de novo.
    const permissao = permissaoCamera?.granted ? permissaoCamera : await pedirPermissaoCamera();

    // Cenário 4: câmera negada (e, além do pedido, a variante bloqueada).
    if (!permissao.granted) {
      if (permissao.canAskAgain) {
        falhar(MENSAGENS.cameraNegada);
      } else {
        falhar(MENSAGENS.cameraBloqueada, true);
      }
      return;
    }

    setCameraPronta(false);
    setMostrarCamera(true);
    limparErro();
  }

  async function tirarFoto() {
    if (!cameraRef || !cameraPronta) return;
    try {
      // base64: false — para exibir, o `uri` basta. Base64 só inflaria a memória.
      // A foto fica no cache do app; salvar na galeria não é assunto desta prática.
      const foto = await cameraRef.takePictureAsync({ base64: false });
      setFotoUri(foto.uri);
      limparErro();
    } catch {
      falhar(MENSAGENS.cameraIndisponivel);
    } finally {
      // PARAR: fecha a câmera tanto no sucesso quanto na falha.
      setMostrarCamera(false);
    }
  }

  function salvar() {
    // O app funciona MESMO quando o usuário nega tudo: local e foto são opcionais.
    // Por isso o botão Salvar fica habilitado SEMPRE.
    onSalvar(local ?? undefined, fotoUri ?? undefined);
  }

  // ----- Renderização: câmera ativa -----
  if (mostrarCamera) {
    return (
      <View style={styles.tela}>
        <CameraView
          ref={setCameraRef}
          style={styles.camera}
          facing="back"
          onCameraReady={() => setCameraPronta(true)}
        />
        <View style={styles.acoes}>
          <Pressable
            onPress={tirarFoto}
            disabled={!cameraPronta}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.botaoAcao,
              styles.botaoFlex,
              (pressed || !cameraPronta) && styles.botaoPressionado,
            ]}
          >
            <Text style={styles.textoBotao}>Tirar foto</Text>
          </Pressable>
          <Pressable
            onPress={() => setMostrarCamera(false)}
            accessibilityRole="button"
            style={({ pressed }) => [styles.botaoCancelar, pressed && styles.botaoPressionado]}
          >
            <Text style={styles.textoBotao}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ----- Renderização: tela principal de registro -----
  return (
    <View style={styles.tela}>
      <Text style={tipografia.titulo}>Registrar passeio de {pet.nome}</Text>

      {erro !== '' && (
        <View style={styles.caixaErro}>
          <Text style={styles.erro}>{erro}</Text>
          {erroBloqueado && (
            <Pressable
              onPress={() => Linking.openSettings()}
              accessibilityRole="button"
              style={({ pressed }) => [styles.botaoAcao, pressed && styles.botaoPressionado]}
            >
              <Text style={styles.textoBotao}>Abrir configurações</Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Localização */}
      {local ? (
        <View style={styles.secao}>
          <Text style={tipografia.corpo}>{formatarLocal(local)}</Text>
        </View>
      ) : (
        <Pressable
          onPress={obterLocalizacao}
          disabled={buscandoLocal}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.botaoAcao,
            (pressed || buscandoLocal) && styles.botaoPressionado,
          ]}
        >
          <Text style={styles.textoBotao}>
            {buscandoLocal ? 'Obtendo localização…' : 'Obter localização'}
          </Text>
        </Pressable>
      )}

      {/* Foto */}
      {fotoUri ? (
        <Image
          source={{ uri: fotoUri }}
          style={styles.previa}
          // "cover" e não "contain": a prévia tem altura fixa e largura total;
          // "cover" preenche o retângulo (recortando as bordas) em vez de deixar
          // faixas vazias dos lados quando a foto tem outra proporção.
          contentFit="cover"
          accessibilityLabel={`Prévia da foto de ${pet.nome}`}
        />
      ) : (
        <Pressable
          onPress={abrirCamera}
          accessibilityRole="button"
          style={({ pressed }) => [styles.botaoAcao, pressed && styles.botaoPressionado]}
        >
          <Text style={styles.textoBotao}>Tirar foto</Text>
        </Pressable>
      )}

      {/* Ações */}
      <View style={styles.acoes}>
        <Pressable
          onPress={salvar}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.botaoAcao,
            styles.botaoFlex,
            pressed && styles.botaoPressionado,
          ]}
        >
          <Text style={styles.textoBotao}>Salvar</Text>
        </Pressable>
        <Pressable
          onPress={onCancelar}
          accessibilityRole="button"
          style={({ pressed }) => [styles.botaoCancelar, pressed && styles.botaoPressionado]}
        >
          <Text style={styles.textoBotao}>Cancelar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    padding: espaco.md,
    paddingTop: layout.topoTela,
    backgroundColor: cores.fundo,
    gap: espaco.md,
  },
  caixaErro: { gap: espaco.sm },
  erro: { ...tipografia.corpo, color: cores.erro },
  secao: { gap: espaco.sm },
  camera: { flex: 1, borderRadius: espaco.sm },
  previa: { width: '100%', height: layout.alturaPrevia, borderRadius: espaco.sm },
  botaoAcao: {
    backgroundColor: cores.primaria,
    padding: espaco.md,
    borderRadius: espaco.sm,
    alignItems: 'center',
  },
  botaoFlex: { flex: 1 },
  botaoCancelar: {
    backgroundColor: cores.textoFraco,
    padding: espaco.md,
    borderRadius: espaco.sm,
    alignItems: 'center',
    flex: 1,
  },
  botaoPressionado: { opacity: toque.opacidadePressionado },
  textoBotao: { color: cores.textoInverso, fontWeight: 'bold' },
  acoes: { flexDirection: 'row', gap: espaco.md },
});