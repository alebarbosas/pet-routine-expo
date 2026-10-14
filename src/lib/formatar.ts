// ============================================================
// Prática 3 — Formatação para humanos (sem JSX, sem React)
// ============================================================

import type { Pet } from '../types/pet';

type Local = NonNullable<Pet['local']>;

// Coordenada crua tem 14 casas decimais e não é informação para o usuário.
// 3 casas ≈ 110 m de resolução, coerente com a precisão que o GPS entrega
// no celular; o raio (±Nm) diz o quanto confiar no número.
// Ex.: "Local: -8.054, -34.871 (±12m)"
export function formatarLocal(local: Local): string {
  const lat = local.latitude.toFixed(3);
  const lng = local.longitude.toFixed(3);
  return `Local: ${lat}, ${lng} (±${Math.round(local.precisaoMetros)}m)`;
}