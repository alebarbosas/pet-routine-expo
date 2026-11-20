import type { Pet } from '../types/pet';
import { rotuloStatusPasseio } from '../types/pet';

export type Secao = { title: string; data: Pet[] };

export function agrupar(pets: Pet[]): Secao[] {
  const grupos = {
    pendente: [] as Pet[],
    concluido: [] as Pet[],
    cancelado: [] as Pet[],
  };

  for (const pet of pets) {
    grupos[pet.statusPasseio].push(pet);
  }

  const secoes: Secao[] = [];

  if (grupos.pendente.length > 0) {
    secoes.push({
      title: rotuloStatusPasseio('pendente'),
      data: grupos.pendente,
    });
  }
  if (grupos.concluido.length > 0) {
    secoes.push({
      title: rotuloStatusPasseio('concluido'),
      data: grupos.concluido,
    });
  }
  if (grupos.cancelado.length > 0) {
    secoes.push({
      title: rotuloStatusPasseio('cancelado'),
      data: grupos.cancelado,
    });
  }

  return secoes;
}

export function filtrarPorNome(pets: Pet[], busca: string): Pet[] {
  if (!busca.trim()) return pets;

  const termo = busca.toLowerCase();
  return pets.filter((p) => p.nome.toLowerCase().includes(termo));
}