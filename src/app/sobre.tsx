import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { cores, espaco, tipografia } from '../theme';

export default function TelaSobre() {
  return (
    <View style={estilos.tela}>
      <View style={estilos.cartao}>
        <Text style={estilos.titulo}>Pet Routine Expo</Text>
        <Text style={estilos.subtitulo}>Versão 1.0.0 • Desenvolvimento Mobile (2026.2.DM)</Text>
        <Text style={estilos.corpo}>
          Aplicativo de gestão e rotina de cuidados e passeios para pets, desenvolvido na CESAR School.
        </Text>
      </View>

      <View style={estilos.cartao}>
        <Text style={estilos.secao}>Equipe e Autoria</Text>
        <Text style={estilos.corpo}>Desenvolvedor(a): Alessandra Barbosa (@alebarbosas)</Text>
      </View>

      <View style={estilos.cartao}>
        <Text style={estilos.secao}>Arquitetura do Aplicativo</Text>
        <Text style={estilos.corpo}>
          • Roteamento baseado em arquivos com Expo Router (src/app/){'\n'}
          • Modelagem estrita em TypeScript sem uso de any{'\n'}
          • Integração nativa com câmera, galeria (1:1) e geolocalização{'\n'}
          • Persistência local (SQLite / AsyncStorage) e API REST autenticada
        </Text>
      </View>

      <Link href="/" style={estilos.voltar}>
        Voltar para Meus Pets
      </Link>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    padding: 24,
    gap: espaco.md,
    backgroundColor: cores.fundo,
  },
  cartao: {
    backgroundColor: cores.cartao,
    borderRadius: 12,
    padding: espaco.md,
    gap: espaco.sm,
  },
  titulo: {
    ...tipografia.titulo,
  },
  subtitulo: {
    ...tipografia.corpo,
    color: cores.textoFraco,
  },
  secao: {
    ...tipografia.titulo,
    fontSize: 16,
  },
  corpo: {
    ...tipografia.corpo,
    lineHeight: 22,
  },
  voltar: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: tipografia.corpo.fontSize,
    textAlign: 'center',
    paddingVertical: espaco.sm,
  },
});
