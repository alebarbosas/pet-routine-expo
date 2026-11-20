export type EspeciePet = 'cachorro' | 'gato' | 'ave' | 'outro';
export type PortePet = 'pequeno' | 'medio' | 'grande';
export type StatusPasseio = 'pendente' | 'concluido' | 'cancelado';

export interface Pet {
  id: string;
  nome: string;
  especie: EspeciePet;
  porte: PortePet;
  statusPasseio: StatusPasseio;
  idadeMeses: number;
  criadoEm: Date;
  local?: { latitude: number; longitude: number; precisaoMetros: number };
  fotoUri?: string;
}

export type NovoPet = Omit<Pet, 'id' | 'statusPasseio' | 'criadoEm'>;
export type ResumoPet = Pick<Pet, 'id' | 'nome' | 'especie' | 'statusPasseio'>;
export type AtualizacaoPet = Partial<NovoPet>;

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

export type EstadoTela<T> =
  | { tipo: 'carregando' }
  | { tipo: 'sucesso'; dados: T }
  | { tipo: 'erro'; mensagem: string };

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

void novo;
void resumo;
void parcial;