// ============================================================
// Prática 2 — Componente Card reutilizável
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Este componente é genérico — ele não sabe nada sobre Pet.
// Props tipadas, children: ReactNode, prop opcional `destacado`.
//
// Restrições:
//   • Sombra com `boxShadow` (uma string), não com shadow*/elevation
//   • Espaçamento interno com `gap`
//   • Nenhum hex ou número mágico — tudo vem do theme.ts
// ============================================================
import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { cores, espaco, layout, sombra } from '../theme';

type CardProps = {
  children: ReactNode;
  // Prop opcional que muda a aparência (borda colorida).
  destacado?: boolean;
};

export function Card({ children, destacado }: CardProps) {
  // Array de estilos: base sempre, variante só quando destacado.
  return <View style={[styles.card, destacado && styles.cardDestacado]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    padding: espaco.md,
    borderRadius: espaco.sm,
    backgroundColor: cores.cartao,
    // Sombra com `boxShadow` (uma string) e espaçamento entre filhos com `gap`.
    boxShadow: sombra.card,
    gap: espaco.sm,
  },
  cardDestacado: {
    // Destacado = borda colorida (justificativa no README da Prática 2).
    borderWidth: layout.bordaDestaque,
    borderColor: cores.primaria,
  },
});