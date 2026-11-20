import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePetStore } from '../store/use-pet-store';
import { useTheme } from '../context/theme-context';
import { espaco, tipografia } from '../theme';

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
  const { tema } = useTheme();
  const { petId } = useLocalSearchParams<{ petId?: string }>();
  const updatePet = usePetStore((state) => state.updatePet);
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [falha, setFalha] = useState<FalhaCamera | null>(null);
  const [salvando, setSalvando] = useState(false);

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

  async function concluir() {
    if (!fotoUri || salvando) return;
    if (petId) {
      setSalvando(true);
      try {
        await updatePet(petId, { fotoUri });
      } finally {
        setSalvando(false);
      }
    }
    router.back();
  }

  return (
    <View style={[estilos.tela, { backgroundColor: tema.fundo }]}>
      {fotoUri ? (
        <Image
          source={{ uri: fotoUri }}
          style={estilos.previa}
          contentFit="cover"
        />
      ) : (
        <View
          style={[
            estilos.previa,
            estilos.placeholder,
            { backgroundColor: tema.cartao, borderColor: tema.azulClaro },
          ]}
        >
          <Text style={[estilos.textoPlaceholder, { color: tema.textoFraco }]}>
            Nenhuma foto selecionada (proporção 1:1)
          </Text>
        </View>
      )}

      {falha ? (
        <View
          style={[
            estilos.caixaErro,
            {
              backgroundColor: tema.primariaSuave,
              borderColor: tema.primaria,
            },
          ]}
        >
          <Text style={[estilos.textoErro, { color: tema.erro }]}>
            {MENSAGENS_FALHA[falha]}
          </Text>
        </View>
      ) : null}

      <View style={estilos.acoes}>
        <Pressable
          onPress={tirarFoto}
          style={({ pressed }) => [
            estilos.botao,
            { backgroundColor: tema.primaria },
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
            { backgroundColor: tema.azulSuave, borderColor: tema.azulClaro },
            pressed && estilos.botaoPressionado,
          ]}
        >
          <Text style={[estilos.textoBotaoAzul, { color: tema.azulTexto }]}>
            Escolher da galeria
          </Text>
        </Pressable>

        <Pressable
          onPress={concluir}
          disabled={!fotoUri || salvando}
          style={({ pressed }) => [
            estilos.botao,
            { backgroundColor: tema.sucesso },
            (!fotoUri || salvando) && estilos.botaoDesabilitado,
            pressed && fotoUri ? estilos.botaoPressionado : null,
          ]}
        >
          <Text style={estilos.textoBotaoClaro}>
            {salvando ? 'Salvando...' : 'Concluir'}
          </Text>
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
  },
  previa: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 14,
  },
  placeholder: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: espaco.md,
  },
  textoPlaceholder: {
    ...tipografia.corpo,
    textAlign: 'center',
  },
  caixaErro: {
    borderWidth: 1,
    borderRadius: 10,
    padding: espaco.sm,
  },
  textoErro: {
    ...tipografia.corpo,
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
  botaoSecundario: {
    borderWidth: 1,
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
    fontWeight: '600',
    fontSize: tipografia.corpo.fontSize,
  },
});