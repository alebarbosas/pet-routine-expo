import { useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { cores, espaco, tipografia } from '../theme';

export default function PetForm() {
  const [nome, setNome] = useState('');
  const [raca, setRaca] = useState('');
  const [alertaVacina, setAlertaVacina] = useState(false);

  const nomeVazio = nome.trim() === '';

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <Text style={styles.rotulo}>Nome do pet</Text>
      <TextInput
        style={[styles.input, nomeVazio && styles.inputInvalido]}
        placeholder="Ex: Rex"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.rotulo}>Raça</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Golden Retriever"
        value={raca}
        onChangeText={setRaca}
      />

      <View style={styles.linha}>
        <Text style={styles.rotulo}>Alerta de vacina</Text>
        <Switch value={alertaVacina} onValueChange={setAlertaVacina} />
      </View>

      <View style={styles.areaBotao}>
        <Button
          title="Salvar"
          onPress={() => {}}
          disabled={nomeVazio}
          color={cores.primaria}
        />
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
  input: {
    borderWidth: 1,
    borderColor: cores.textoFraco,
    borderRadius: espaco.sm,
    padding: espaco.sm,
    fontSize: tipografia.corpo.fontSize,
  },
  inputInvalido: {
    borderColor: cores.erro,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rotulo: {
    ...tipografia.corpo,
  },
  areaBotao: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: espaco.lg,
  },
});