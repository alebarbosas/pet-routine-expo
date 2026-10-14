// ============================================================
// Prática 2/3 — Card do pet
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Usa o Card reutilizável e os tipos do domínio.
// Mostra: miniatura (se houver), nome, espécie + status do passeio
// (um em cada ponta), idade e local (se houver).
// Oferece uma ação "Registrar passeio".
//
// Na Prática 3 a ação passou de `<Text onPress>` para `Pressable`:
// é o componente de toque da prática, com `pressed` e acessibilidade.
// ============================================================
import { Pressable, StyleSheet, Text, View } from 'react-native';
// Atenção ao import: `Image` vem do expo-image, NÃO do react-native
// (os dois têm um componente com o mesmo nome).
import { Image } from 'expo-image';

import { type Pet, rotuloEspecie, rotuloStatusPasseio } from '../types/pet';
import { formatarLocal } from '../lib/formatar';
import { cores, espaco, layout, tipografia, toque } from '../theme';
import { Card } from './card';

type CardPetProps = {
  pet: Pet;
  aoRegistrarPasseio: () => void;
};

export function CardPet({ pet, aoRegistrarPasseio }: CardPetProps) {
  return (
    <Card>
      {pet.fotoUri ? (
        // contentFit="cover": a miniatura tem proporção fixa (largura total x 120);
        // "cover" preenche todo o espaço recortando as sobras, sem faixas vazias.
        // "contain" deixaria barras nas laterais para fotos que não têm essa proporção.
        // `recyclingKey` evita mostrar a foto do pet anterior quando a célula é reaproveitada.
        <Image
          source={{ uri: pet.fotoUri }}
          style={styles.miniatura}
          contentFit="cover"
          recyclingKey={pet.id}
          transition={200}
          accessibilityLabel={`Foto de ${pet.nome}`}
        />
      ) : (
        <View style={[styles.miniatura, styles.miniaturaVazia]} />
      )}

      <Text style={tipografia.titulo}>{pet.nome}</Text>

      <View style={styles.linha}>
        <Text style={tipografia.corpo}>{rotuloEspecie(pet.especie)}</Text>
        <Text style={tipografia.corpo}>{rotuloStatusPasseio(pet.statusPasseio)}</Text>
      </View>

      <Text style={tipografia.legenda}>{pet.idadeMeses} meses</Text>

      {/* Sem local → não mostra nada (nem placeholder). */}
      {pet.local ? <Text style={tipografia.legenda}>{formatarLocal(pet.local)}</Text> : null}

      {/* O card não sabe O QUE fazer; só avisa que o toque aconteceu. */}
      <Pressable
        onPress={aoRegistrarPasseio}
        accessibilityRole="button"
        accessibilityLabel={`Registrar passeio de ${pet.nome}`}
        style={({ pressed }) => [pressed && styles.botaoPressionado]}
      >
        <Text style={styles.botao}>Registrar passeio</Text>
      </Pressable>
    </Card>
  );
}

// O espaçamento vertical entre os filhos vem do `gap` do Card; sem margin aqui.
const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botao: {
    fontWeight: 'bold',
    color: cores.primaria,
  },
  botaoPressionado: {
    opacity: toque.opacidadePressionado,
  },
  miniatura: {
    width: '100%',
    height: layout.alturaMiniatura,
    borderRadius: espaco.sm,
  },
  miniaturaVazia: {
    backgroundColor: cores.fundo,
  },
});