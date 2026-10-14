// ============================================================
// Prática 3 — Estado vazio da lista
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Toda lista tem ListEmptyComponent. Sem exceção.
// E o texto do estado vazio precisa AJUDAR o usuário:
//   - primeiro acesso → o que ele pode fazer
//   - busca sem resultado → o que ele pode tentar
// ============================================================
import { StyleSheet, Text, View } from 'react-native';

import { cores, espaco, tipografia } from '../theme';

type ListaVaziaProps = {
  // Se definido e não-vazio → "busca sem resultado".
  // Senão → "primeiro acesso" (a lista está vazia de verdade).
  termoBusca?: string;
};

export function ListaVazia({ termoBusca }: ListaVaziaProps) {
  const termo = termoBusca?.trim() ?? '';
  const buscando = termo !== '';

  return (
    <View style={styles.container}>
      <Text style={styles.texto}>
        {buscando
          ? `Nenhum pet encontrado para "${termo}". Confira a grafia ou apague a busca para ver todos.`
          : 'Nenhum pet cadastrado. Que tal adicionar um? Puxe a lista para baixo para recarregar.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: espaco.xl,
  },
  texto: {
    ...tipografia.corpo,
    color: cores.textoFraco,
    textAlign: 'center',
  },
});