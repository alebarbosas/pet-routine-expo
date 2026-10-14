// ============================================================
// Prática 3 — Agrupamento e filtragem de pets
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Funções puras — sem JSX, sem estado, sem React.
// Moram aqui para serem testáveis e reutilizáveis independentemente.
// ============================================================

import { type Pet, type StatusPasseio, rotuloStatusPasseio } from '../types/pet';

export type Secao = { title: string; data: Pet[] };

// DECISÃO DE PRODUTO (P3.4): a ordem das seções é
//   1. pendente   → é o que exige ação do dono, então fica no topo da tela;
//   2. concluido  → já foi resolvido; é histórico de consulta;
//   3. cancelado  → o menos relevante no dia a dia, por último.
// A ordem é uma constante explícita (e não a ordem em que os pets aparecem
// no array) para que mexer num pet não reordene as seções.
const ORDEM_STATUS: StatusPasseio[] = ['pendente', 'concluido', 'cancelado'];

export function agrupar(pets: Pet[]): Secao[] {
  // Critério escolhido: statusPasseio. Como o toque no item alterna o status,
  // o pet "pula" de seção na hora — o agrupamento reage diretamente à interação.
  const grupos = new Map<StatusPasseio, Pet[]>();

  for (const pet of pets) {
    const grupo = grupos.get(pet.statusPasseio);
    if (grupo) {
      grupo.push(pet); // `grupo` é um array local desta função, não estado do React
    } else {
      grupos.set(pet.statusPasseio, [pet]);
    }
  }

  return ORDEM_STATUS.flatMap((status): Secao[] => {
    const data = grupos.get(status) ?? [];
    // P3.3: grupo sem itens não vira seção.
    return data.length > 0 ? [{ title: rotuloStatusPasseio(status), data }] : [];
  });
}

export function filtrarPorNome(pets: Pet[], busca: string): Pet[] {
  // Busca vazia (ou só espaços) devolve todos. Sem acento/caixa: "agata" acha "Ágata".
  const termo = normalizar(busca);
  if (termo === '') return pets;
  return pets.filter((pet) => normalizar(pet.nome).includes(termo));
}

function normalizar(texto: string): string {
  return texto
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}