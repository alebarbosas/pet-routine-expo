// ============================================================
// Prática 3 — Item tocável da lista de pets
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Envolve o CardPet num Pressable para toque curto e longo.
// A ação vai em onPress, feedback visual vai no `pressed`.
// Nunca onPressIn.
// ============================================================
import { Pressable, StyleSheet } from 'react-native';

import { type Pet, rotuloEspecie, rotuloStatusPasseio } from '../types/pet';
import { toque } from '../theme';
import { CardPet } from './card-pet';

type ItemPetProps = {
  pet: Pet;
  onAlternar: (id: string) => void;
  onRemover: (id: string) => void;
  onRegistrar: (id: string) => void;
};

export function ItemPet({ pet, onAlternar, onRemover, onRegistrar }: ItemPetProps) {
  return (
    <Pressable
      // Toque curto alterna o status do passeio; toque longo remove o pet.
      // As duas ações ficam em onPress/onLongPress — nunca em onPressIn.
      onPress={() => onAlternar(pet.id)}
      onLongPress={() => onRemover(pet.id)}
      accessibilityRole="button"
      accessibilityLabel={`${pet.nome}, ${rotuloEspecie(pet.especie)}, passeio ${rotuloStatusPasseio(pet.statusPasseio)}`}
      accessibilityHint="Toque para alternar o passeio. Toque e segure para remover."
      // hitSlop = toque.hitSlop (4): amplia a área de toque sem mexer no visual,
      // mas continua menor que o gap da lista (8) para não invadir o item vizinho.
      hitSlop={toque.hitSlop}
      // unstable_pressDelay = toque.atrasoFeedbackMs (100 ms): só mostra o feedback
      // `pressed` se o dedo ficar parado; ao rolar a lista o item não "pisca".
      unstable_pressDelay={toque.atrasoFeedbackMs}
      style={({ pressed }) => [
        styles.item,
        // Feedback visual SÓ aqui, via `pressed`.
        pressed && styles.itemPressionado,
      ]}
    >
      {/* O botão "Registrar passeio" dentro do CardPet é um Pressable próprio:
          o filho mais interno ganha o toque, então ele não dispara o onPress do item. */}
      <CardPet pet={pet} aoRegistrarPasseio={() => onRegistrar(pet.id)} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // SEM margin aqui: o espaço entre itens vem do `gap` no contentContainerStyle da lista.
  item: {},
  itemPressionado: {
    opacity: toque.opacidadePressionado,
  },
});