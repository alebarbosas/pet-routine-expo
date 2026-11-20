import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { cores, espaco, tipografia } from '../theme';

export default function TelaConfiguracoes() {
  return (
    <View style={styles.tela}>
      <View style={styles.cartao}>
        <Text style={styles.titulo}>Preferências do Aplicativo</Text>
        <Text style={styles.corpo}>
          • Notificações locais de lembrete de passeio: Ativas (intervalo de 5s para teste){'\n'}
          • Recorte padrão de fotografia: 1:1 (quadrado) sem base64{'\n'}
          • Identidade visual: Bordô, Azul Claro e Off-White
        </Text>
      </View>

      <Link href="/sobre" style={styles.link}>
        Sobre o Aplicativo
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
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
    borderWidth: 1,
    borderColor: cores.borda,
  },
  titulo: {
    ...tipografia.titulo,
    fontSize: 18,
    color: cores.primaria,
  },
  corpo: {
    ...tipografia.corpo,
    lineHeight: 22,
  },
  link: {
    backgroundColor: cores.azulSuave,
    color: cores.azulTexto,
    borderWidth: 1,
    borderColor: cores.azulClaro,
    borderRadius: 10,
    overflow: 'hidden',
    paddingVertical: 12,
    fontWeight: '600',
    fontSize: tipografia.corpo.fontSize,
    textAlign: 'center',
  },
});