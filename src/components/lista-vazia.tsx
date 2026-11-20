import { StyleSheet, Text, View } from 'react-native';
import { cores, espaco, tipografia } from '../theme';

type ListaVaziaProps = {
  termoBusca: string;
  totalPets?: number;
};

export function ListaVazia({ termoBusca, totalPets }: ListaVaziaProps) {
  const contaSemPets = totalPets === 0 && termoBusca.trim() === '';

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {contaSemPets ? 'Nenhum pet cadastrado ainda' : 'Nenhum pet encontrado'}
      </Text>
      <Text style={styles.descricao}>
        {contaSemPets
          ? 'Toque em "+ Novo Pet" acima para cadastrar o primeiro pet da sua rotina.'
          : `Não encontramos resultados para "${termoBusca}". Tente buscar por outro nome.`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: espaco.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco.sm,
    backgroundColor: cores.cartao,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  titulo: {
    ...tipografia.titulo,
    fontSize: 18,
    textAlign: 'center',
  },
  descricao: {
    ...tipografia.corpo,
    color: cores.textoFraco,
    textAlign: 'center',
  },
});