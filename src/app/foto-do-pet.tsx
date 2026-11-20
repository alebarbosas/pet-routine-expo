import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePetStore } from '../store/use-pet-store';
import { cores, espaco, tipografia } from '../theme';

type FalhaCamera = 'camera-negada' | 'camera-bloqueada' | 'galeria-negada';

const MENSAGENS_FALHA: Record<FalhaCamera, string> = {
  'camera-negada':
    'Você negou o acesso à câmera agora. Toque novamente em "Tirar foto" e aceite a permissão, ou escolha uma imagem da galeria abaixo.',
  'camera-bloqueada':
    'O acesso à câmera está bloqueado nas configurações do sistema. Abra os Ajustes do aparelho para liberar a câmera ou escolha uma foto pela galeria abaixo.',
  'galeria-negada':
    'Permissão da galeria não concedida. Autorize o acesso às fotos nas configurações do dispositivo para selecionar uma imagem.',
};

export default function TelaFotoDoPet() {
  const router = useRouter();
  const { petId } = useLocalSearchParams<{ petId?: string }>();
  const atualizarFoto = usePetStore((state) => state.atualizarFoto);
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [falha, setFalha] = useState<FalhaCamera | null>(null);

  async function escolherDaGaleria() {
    // Contrato de Três Tempos (Galeria):
    // 1. PEDIR: solicita autorização explícita para acessar a galeria de mídia.
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      setFalha('galeria-negada');
      return;
    }

    // 2. LER: abre o seletor nativo com recorte quadrado (1:1) apenas para imagens.
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    // 3. PARAR: encerra sem erro caso o tutor cancele antes de ler resultado.assets.
    if (resultado.canceled) return;

    setFalha(null);
    setFotoUri(resultado.assets[0].uri);
  }

  async function tirarFoto() {
    // Contrato de Três Tempos (Câmera):
    // 1. PEDIR: solicita acesso à câmera e distingue negação temporária de bloqueio permanente.
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      setFalha(permissao.canAskAgain ? 'camera-negada' : 'camera-bloqueada');
      return;
    }

    // 2. LER: abre a câmera do sistema com recorte quadrado (1:1) sem base64 desnecessário.
    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    // 3. PARAR: interrompe o fluxo sem falha caso o tutor feche a câmera sem confirmar.
    if (resultado.canceled) return;

    setFalha(null);
    setFotoUri(resultado.assets[0].uri);
  }

  function concluir() {
    if (!fotoUri) return;
    if (petId) {
      atualizarFoto(petId, fotoUri);
    }
    router.back();
  }

  return (
    <View style={estilos.tela}>
      {fotoUri ? (
        <Image
          source={{ uri: fotoUri }}
          style={estilos.previa}
          contentFit="cover"
        />
      ) : (
        <View style={[estilos.previa, estilos.placeholder]}>
          <Text style={estilos.textoPlaceholder}>
            Nenhuma foto selecionada (proporção 1:1)
          </Text>
        </View>
      )}

      {falha ? (
        <View style={estilos.caixaErro}>
          <Text style={estilos.textoErro}>{MENSAGENS_FALHA[falha]}</Text>
        </View>
      ) : null}

      <View style={estilos.acoes}>
        <Pressable
          onPress={tirarFoto}
          style={({ pressed }) => [
            estilos.botao,
            estilos.botaoPrimario,
            pressed && estilos.botaoPressionado,
          ]}
        >
          <Text style={estilos.textoBotaoClaro}>Tirar foto</Text>
        </Pressable>

        <Pressable
          onPress={escolherDaGaleria}
          style={({ pressed }) => [
            estilos.botao,
            estilos.botaoSecundario,
            pressed && estilos.botaoPressionado,
          ]}
        >
          <Text style={estilos.textoBotaoAzul}>Escolher da galeria</Text>
        </Pressable>

        <Pressable
          onPress={concluir}
          disabled={!fotoUri}
          style={({ pressed }) => [
            estilos.botao,
            estilos.botaoConfirmar,
            !fotoUri && estilos.botaoDesabilitado,
            pressed && fotoUri ? estilos.botaoPressionado : null,
          ]}
        >
          <Text style={estilos.textoBotaoClaro}>Concluir</Text>
        </Pressable>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    padding: 24,
    gap: 16,
    backgroundColor: cores.fundo,
  },
  previa: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 14,
  },
  placeholder: {
    backgroundColor: cores.cartao,
    borderWidth: 1,
    borderColor: cores.azulClaro,
    alignItems: 'center',
    justifyContent: 'center',
    padding: espaco.md,
  },
  textoPlaceholder: {
    ...tipografia.corpo,
    color: cores.textoFraco,
    textAlign: 'center',
  },
  caixaErro: {
    backgroundColor: cores.primariaSuave,
    borderWidth: 1,
    borderColor: cores.primaria,
    borderRadius: 10,
    padding: espaco.sm,
  },
  textoErro: {
    ...tipografia.corpo,
    color: cores.primariaEscura,
  },
  acoes: {
    gap: espaco.sm,
  },
  botao: {
    paddingVertical: 14,
    paddingHorizontal: espaco.md,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoPrimario: {
    backgroundColor: cores.primaria,
  },
  botaoSecundario: {
    backgroundColor: cores.azulSuave,
    borderWidth: 1,
    borderColor: cores.azulClaro,
  },
  botaoConfirmar: {
    backgroundColor: cores.sucesso,
  },
  botaoDesabilitado: {
    opacity: 0.45,
  },
  botaoPressionado: {
    opacity: 0.8,
  },
  textoBotaoClaro: {
    color: '#FAF8F5',
    fontWeight: '600',
    fontSize: tipografia.corpo.fontSize,
  },
  textoBotaoAzul: {
    color: cores.azulTexto,
    fontWeight: '600',
    fontSize: tipografia.corpo.fontSize,
  },
});