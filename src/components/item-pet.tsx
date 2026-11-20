import { Pressable, StyleSheet } from 'react-native';

import type { Pet } from '../types/pet';
import { CardPet } from './card-pet';

type ItemPetProps = {
  pet: Pet;
  onAbrirDetalhe: (id: string) => void;
  onAlternar: (id: string) => void;
  onRegistrar: (id: string) => void;
};

export function ItemPet({ pet, onAbrirDetalhe, onAlternar, onRegistrar }: ItemPetProps) {
  return (
    <Pressable
      onPress={() => onAbrirDetalhe(pet.id)}
      onLongPress={() => onAlternar(pet.id)}
      accessibilityRole="button"
      accessibilityLabel={`${pet.nome}, toque para ver detalhes ou segure para alternar passeio`}
      hitSlop={10}
      unstable_pressDelay={150}
      style={({ pressed }) => [styles.item, pressed && styles.pressionado]}
    >
      <CardPet pet={pet} aoRegistrarPasseio={() => onRegistrar(pet.id)} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {},
  pressionado: {
    opacity: 0.78,
  },
});