// ============================================================
// P1.1.1 — Union types literais
// ============================================================
export type EspeciePet = 'cachorro' | 'gato' | 'ave' | 'outro';
export type PortePet = 'pequeno' | 'medio' | 'grande';
export type StatusPasseio = 'pendente' | 'concluido' | 'cancelado';

// ============================================================
// P1.1.2 — Entidade completa
// ============================================================
export interface Pet {
  id: string;
  nome: string;
  especie: EspeciePet;
  porte: PortePet;
  statusPasseio: StatusPasseio;
  idadeMeses: number;
  criadoEm: string; // ISO 8601: JSON não tem Date, então a data chega do servidor como string
}

// ============================================================
// P1.1.3 — Tipos derivados (sem redigitar campos)
// ============================================================
export type NovoPet = Omit<Pet, 'id' | 'criadoEm' | 'statusPasseio'>;
export type ResumoPet = Pick<Pet, 'id' | 'nome' | 'especie' | 'statusPasseio'>;
export type AtualizacaoPet = Partial<NovoPet>;

// ============================================================
// P1.1.4 — Rótulos com switch exaustivo, SEM default
 // ============================================================
export function rotuloStatusPasseio(status: StatusPasseio): string {
  switch (status) {
    case 'pendente':
      return 'Pendente';
    case 'concluido':
      return 'Concluído';
    case 'cancelado':
      return 'Cancelado';
  }
}

export function rotuloEspecie(especie: EspeciePet): string {
  switch (especie) {
    case 'cachorro':
      return 'Cachorro';
    case 'gato':
      return 'Gato';
    case 'ave':
      return 'Ave';
    case 'outro':
      return 'Outro';
  }
}

// ============================================================
// VERIFICAÇÃO — não apague
// ============================================================
// DEVEM compilar exatamente assim, sem campos a mais nem a menos:
const novo: NovoPet = {
  nome: 'Fubá',
  especie: 'gato',
  porte: 'pequeno',
  idadeMeses: 30,
};

const resumo: ResumoPet = {
  id: 'p1',
  nome: 'Fubá',
  especie: 'gato',
  statusPasseio: 'pendente',
};

const parcial: AtualizacaoPet = { idadeMeses: 31 };

// DEVEM dar erro — descomente uma de cada vez para confirmar:
//const errado1: NovoPet = { nome: 'Fubá', especie: 'gato', porte: 'pequeno', idadeMeses: 30, id: 'p1' };
//const errado2: NovoPet = { nome: 'Fubá', especie: 'peixe', porte: 'pequeno', idadeMeses: 30 };
//const errado3: ResumoPet = { id: 'p1', nome: 'Fubá', especie: 'gato' };
//const errado4: AtualizacaoPet = { statusPasseio: 'concluido' };