import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { type Pet, rotuloEspecie, rotuloStatusPasseio } from '../types/pet';
import { cores, espaco, tipografia } from '../theme';
import { Card } from './card';

type CardPetProps = {
  pet: Pet;
  aoRegistrarPasseio: () => void;
};

export function CardPet({ pet, aoRegistrarPasseio }: CardPetProps) {
  return (
    <Card>
      {pet.fotoUri ? (
        <Image
          source={{ uri: pet.fotoUri }}
          style={styles.miniatura}
          contentFit="cover"
          recyclingKey={pet.id}
          transition={200}
        />
      ) : (
        <View style={[styles.miniatura, styles.miniaturaVazia]} />
      )}

      <Text style={tipografia.titulo}>{pet.nome}</Text>

      <View style={styles.linha}>
        <Text style={tipografia.corpo}>{rotuloEspecie(pet.especie)}</Text>
        <Text style={tipografia.corpo}>
          {rotuloStatusPasseio(pet.statusPasseio)}
        </Text>
      </View>

      <Text style={tipografia.legenda}>{pet.idadeMeses} meses</Text>

      {pet.local && (
        <Text style={tipografia.corpo}>
          Local: {pet.local.latitude.toFixed(3)}, {pet.local.longitude.toFixed(3)} (±{Math.round(pet.local.precisaoMetros)}m)
        </Text>
      )}

      <Text style={styles.botao} onPress={aoRegistrarPasseio}>
        Registrar passeio
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: espaco.sm,
  },
  botao: {
    marginTop: espaco.md,
    fontWeight: 'bold',
    color: cores.primaria,
  },
  miniatura: {
    width: '100%',
    height: 120,
    borderRadius: espaco.sm,
    marginBottom: espaco.sm,
  },
  miniaturaVazia: {
    backgroundColor: cores.fundo,
  },
});