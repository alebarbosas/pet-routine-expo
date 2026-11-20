import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { useTheme } from '../context/theme-context';
import { espaco, tipografia } from '../theme';

export default function TelaConfiguracoes() {
  const { tema, modo, toggleTheme } = useTheme();

  return (
    <View style={[styles.tela, { backgroundColor: tema.fundo }]}>
      <View
        style={[
          styles.cartao,
          { backgroundColor: tema.cartao, borderColor: tema.borda },
        ]}
      >
        <Text style={[styles.titulo, { color: tema.primaria }]}>
          Aparência e Tema
        </Text>
        <Text style={[styles.corpo, { color: tema.texto }]}>
          Tema atual: {modo === 'claro' ? 'Claro (Off-White & Bordô)' : 'Escuro (Vinho & Azul Claro)'}
        </Text>

        <Pressable
          onPress={toggleTheme}
          style={({ pressed }) => [
            styles.botaoTema,
            { backgroundColor: tema.primaria },
            pressed && styles.pressionado,
          ]}
        >
          <Text style={styles.textoBotaoClaro}>
            Alternar para modo {modo === 'claro' ? 'Escuro' : 'Claro'}
          </Text>
        </Pressable>
      </View>

      <View
        style={[
          styles.cartao,
          { backgroundColor: tema.cartao, borderColor: tema.borda },
        ]}
      >
        <Text style={[styles.titulo, { color: tema.primaria }]}>
          Preferências do Aplicativo
        </Text>
        <Text style={[styles.corpo, { color: tema.texto }]}>
          • Notificações locais de lembrete de passeio: Ativas (intervalo de 5s para teste){'\n'}
          • Recorte padrão de fotografia: 1:1 (quadrado) sem base64{'\n'}
          • Persistência local: AsyncStorage (tema) e SQLite (histórico de passeios)
        </Text>
      </View>

      <Link
        href="/sobre"
        style={[
          styles.link,
          {
            backgroundColor: tema.azulSuave,
            color: tema.azulTexto,
            borderColor: tema.azulClaro,
          },
        ]}
      >
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
  },
  cartao: {
    borderRadius: 12,
    padding: espaco.md,
    gap: espaco.sm,
    borderWidth: 1,
  },
  titulo: {
    ...tipografia.titulo,
    fontSize: 18,
  },
  corpo: {
    ...tipografia.corpo,
    lineHeight: 22,
  },
  botaoTema: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotaoClaro: {
    color: '#FAF8F5',
    fontWeight: '600',
    fontSize: tipografia.corpo.fontSize,
  },
  link: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    paddingVertical: 12,
    fontWeight: '600',
    fontSize: tipografia.corpo.fontSize,
    textAlign: 'center',
  },
  pressionado: {
    opacity: 0.8,
  },
});