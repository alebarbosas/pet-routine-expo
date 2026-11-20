import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { usePetStore } from '../../store/use-pet-store';
import { useTheme } from '../../context/theme-context';
import { espaco, tipografia } from '../../theme';

export default function TelaEstatisticas() {
  const pets = usePetStore((state) => state.pets);
  const { tema, modo, toggleTheme } = useTheme();

  const total = pets.length;
  const concluidos = pets.filter((p) => p.statusPasseio === 'concluido').length;
  const pendentes = pets.filter((p) => p.statusPasseio === 'pendente').length;
  const cancelados = pets.filter((p) => p.statusPasseio === 'cancelado').length;
  const percentual = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  return (
    <ScrollView
      style={[styles.tela, { backgroundColor: tema.fundo }]}
      contentContainerStyle={styles.conteudo}
    >
      <View style={[styles.cartaoDestaque, { backgroundColor: tema.primaria }]}>
        <Text style={[styles.rotuloDestaque, { color: tema.azulClaro }]}>
          Meta de passeios de hoje
        </Text>
        <Text style={styles.valorDestaque}>{percentual}%</Text>
        <Text style={styles.subtituloDestaque}>
          {concluidos} de {total} passeios concluídos
        </Text>
      </View>

      <View style={styles.grade}>
        <View
          style={[
            styles.cartaoMetrica,
            { backgroundColor: tema.cartao, borderColor: tema.borda },
          ]}
        >
          <Text style={[styles.numero, { color: tema.primaria }]}>{total}</Text>
          <Text style={[styles.rotuloMetrica, { color: tema.textoFraco }]}>
            Total de Pets
          </Text>
        </View>
        <View
          style={[
            styles.cartaoMetrica,
            { backgroundColor: tema.cartao, borderColor: tema.borda },
          ]}
        >
          <Text style={[styles.numero, { color: tema.sucesso }]}>{concluidos}</Text>
          <Text style={[styles.rotuloMetrica, { color: tema.textoFraco }]}>
            Concluídos
          </Text>
        </View>
        <View
          style={[
            styles.cartaoMetrica,
            { backgroundColor: tema.cartao, borderColor: tema.borda },
          ]}
        >
          <Text style={[styles.numero, { color: tema.alerta }]}>{pendentes}</Text>
          <Text style={[styles.rotuloMetrica, { color: tema.textoFraco }]}>
            Pendentes
          </Text>
        </View>
        <View
          style={[
            styles.cartaoMetrica,
            { backgroundColor: tema.cartao, borderColor: tema.borda },
          ]}
        >
          <Text style={[styles.numero, { color: tema.erro }]}>{cancelados}</Text>
          <Text style={[styles.rotuloMetrica, { color: tema.textoFraco }]}>
            Cancelados
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.cartaoInfo,
          { backgroundColor: tema.cartao, borderColor: tema.borda },
        ]}
      >
        <Text style={[styles.tituloSecao, { color: tema.primaria }]}>
          Tema e Preferências
        </Text>
        <Text style={[styles.corpo, { color: tema.texto }]}>
          Modo visual ativo: {modo === 'claro' ? 'Claro (Off-White)' : 'Escuro (Vinho)'}
        </Text>
        <Pressable
          onPress={toggleTheme}
          style={({ pressed }) => [
            styles.botaoTema,
            { backgroundColor: tema.azulSuave, borderColor: tema.azulClaro },
            pressed && styles.pressionado,
          ]}
        >
          <Text style={[styles.textoBotaoTema, { color: tema.azulTexto }]}>
            Alternar para modo {modo === 'claro' ? 'Escuro' : 'Claro'}
          </Text>
        </Pressable>
        <Link href="/settings" style={[styles.link, { color: tema.azulTexto }]}>
          Abrir Configurações (/settings)
        </Link>
        <Link href="/sobre" style={[styles.link, { color: tema.azulTexto }]}>
          Ver página institucional (/sobre)
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
  },
  conteudo: {
    padding: espaco.md,
    gap: espaco.md,
  },
  cartaoDestaque: {
    borderRadius: 14,
    padding: espaco.lg,
    gap: 6,
  },
  rotuloDestaque: {
    fontSize: 14,
    fontWeight: '600',
  },
  valorDestaque: {
    color: '#FAF8F5',
    fontSize: 36,
    fontWeight: '700',
  },
  subtituloDestaque: {
    color: '#FAF8F5',
    fontSize: 14,
  },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espaco.sm,
  },
  cartaoMetrica: {
    width: '48%',
    borderRadius: 12,
    padding: espaco.md,
    gap: 4,
    borderWidth: 1,
  },
  numero: {
    fontSize: 26,
    fontWeight: '700',
  },
  rotuloMetrica: {
    ...tipografia.corpo,
  },
  cartaoInfo: {
    borderRadius: 12,
    padding: espaco.md,
    gap: espaco.sm,
    borderWidth: 1,
  },
  tituloSecao: {
    ...tipografia.titulo,
    fontSize: 16,
  },
  corpo: {
    ...tipografia.corpo,
    lineHeight: 20,
  },
  botaoTema: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  textoBotaoTema: {
    fontWeight: '600',
    fontSize: tipografia.corpo.fontSize,
  },
  link: {
    fontWeight: '600',
    fontSize: tipografia.corpo.fontSize,
  },
  pressionado: {
    opacity: 0.8,
  },
});