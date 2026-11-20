import type { Pet } from '../types/pet';

const SIMULAR_ERRO = false;
const ATRASO_MS = 1000;

const MOCK: Pet = {
  id: 'pet-123',
  nome: 'Rex',
  especie: 'cachorro',
  porte: 'medio',
  statusPasseio: 'pendente',
  idadeMeses: 24,
  criadoEm: new Date('2025-01-01T00:00:00Z'),
};

export async function buscarPetEmDestaque(): Promise<Pet> {
  await new Promise((r) => setTimeout(r, ATRASO_MS));

  if (SIMULAR_ERRO) {
    throw new Error(
      'Não foi possível carregar os dados do pet. Verifique sua conexão e tente novamente.'
    );
  }

  return MOCK;
}

export async function registrarPasseio(pet: Pet): Promise<Pet> {
  return { ...pet, statusPasseio: 'concluido' };
}

void SIMULAR_ERRO;
void ATRASO_MS;
void MOCK;