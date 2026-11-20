import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { usePetStore } from '../../store/use-pet-store';
import { cores, espaco, tipografia } from '../../theme';

export default function TelaEstatisticas() {
  const pets = usePetStore((state) => state.pets);

  const total = pets.length;
  const concluidos = pets.filter((p) => p.statusPasseio === 'concluido').length;
  const pendentes = pets.filter((p) => p.statusPasseio === 'pendente').length;
  const cancelados = pets.filter((p) => p.statusPasseio === 'cancelado').length;
  const percentual = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={styles.conteudo}
    >
      <View style={styles.cartaoDestaque}>
        <Text style={styles.rotuloDestaque}>Meta de passeios de hoje</Text>
        <Text style={styles.valorDestaque}>{percentual}%</Text>
        <Text style={styles.subtituloDestaque}>
          {concluidos} de {total} passeios concluídos
        </Text>
      </View>

      <View style={styles.grade}>
        <View style={styles.cartaoMetrica}>
          <Text style={styles.numero}>{total}</Text>
          <Text style={styles.rotuloMetrica}>Total de Pets</Text>
        </View>
        <View style={styles.cartaoMetrica}>
          <Text style={[styles.numero, styles.corConcluido]}>{concluidos}</Text>
          <Text style={styles.rotuloMetrica}>Concluídos</Text>
        </View>
        <View style={styles.cartaoMetrica}>
          <Text style={[styles.numero, styles.corPendente]}>{pendentes}</Text>
          <Text style={styles.rotuloMetrica}>Pendentes</Text>
        </View>
        <View style={styles.cartaoMetrica}>
          <Text style={[styles.numero, styles.corCancelado]}>{cancelados}</Text>
          <Text style={styles.rotuloMetrica}>Cancelados</Text>
        </View>
      </View>

      <View style={styles.cartaoInfo}>
        <Text style={styles.tituloSecao}>Atalhos Rápidos</Text>
        <Text style={styles.corpo}>
          Toque em qualquer pet na aba "Meus Pets" para abrir os detalhes, alterar foto 1:1, registrar passeio com GPS ou agendar um lembrete de notificação.
        </Text>
        <Link href="/settings" style={styles.link}>
          Abrir Configurações (/settings)
        </Link>
        <Link href="/sobre" style={styles.link}>
          Ver página institucional (/sobre)
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    padding: espaco.md,
    gap: espaco.md,
  },
  cartaoDestaque: {
    backgroundColor: cores.primaria,
    borderRadius: 14,
    padding: espaco.lg,
    gap: 6,
  },
  rotuloDestaque: {
    color: cores.azulClaro,
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
    backgroundColor: cores.cartao,
    borderRadius: 12,
    padding: espaco.md,
    gap: 4,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  numero: {
    fontSize: 26,
    fontWeight: '700',
    color: cores.primaria,
  },
  corConcluido: {
    color: cores.sucesso,
  },
  corPendente: {
    color: cores.alerta,
  },
  corCancelado: {
    color: cores.erro,
  },
  rotuloMetrica: {
    ...tipografia.corpo,
    color: cores.textoFraco,
  },
  cartaoInfo: {
    backgroundColor: cores.cartao,
    borderRadius: 12,
    padding: espaco.md,
    gap: espaco.sm,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  tituloSecao: {
    ...tipografia.titulo,
    fontSize: 16,
    color: cores.primaria,
  },
  corpo: {
    ...tipografia.corpo,
    lineHeight: 20,
  },
  link: {
    color: cores.azulTexto,
    fontWeight: '600',
    fontSize: tipografia.corpo.fontSize,
  },
});