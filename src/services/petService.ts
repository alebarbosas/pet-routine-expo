import type { Pet } from '../types/pet';

// Deixe esta constante no código para conseguir testar o caminho de erro
// sem editar mais nada.
const SIMULAR_ERRO = false;
const ATRASO_MS = 1000; // para o estado de carregando ser visível

// P1.2.1 — pet mockado (satisfaz `Pet` inteiro, sem `as`)
const MOCK: Pet = {
  id: 'p1',
  nome: 'Fubá',
  especie: 'gato',
  porte: 'pequeno',
  statusPasseio: 'pendente',
  idadeMeses: 30,
  criadoEm: '2026-01-15T10:00:00.000Z',
};

/**
 * Devolve UM pet — o do tutor logado. Assinatura propositalmente idêntica
 * à que uma chamada HTTP real teria, para a troca ser indolor.
 */
export async function buscarPetDoUsuario(): Promise<Pet> {
  // P1.2.2 — atraso artificial
  await new Promise((r) => setTimeout(r, ATRASO_MS));

  // P1.2.3 — erro com mensagem legível para o usuário final
  if (SIMULAR_ERRO) {
    throw new Error(
      'Não foi possível carregar seu pet. Verifique sua conexão e tente novamente.'
    );
  }

  // P1.2.4
  return MOCK;
}

/**
 * Registra o passeio do dia. Por enquanto só devolve o pet com o
 * status atualizado; persistência é assunto de aula futura.
 */
export async function registrarPasseio(pet: Pet): Promise<Pet> {
  // P1.2.5 — cópia, sem mutar o objeto recebido
  return { ...pet, statusPasseio: 'concluido' };
}

// Teste final: adicionar `microchip: string` a Pet exigiu editar 0 dos 3 tipos derivados.
// NovoPet, ResumoPet e AtualizacaoPet são gerados a partir de Pet (Omit, Pick, Partial),
// então acompanham a mudança sozinhos. Redigitando os campos, seriam 3 edições
// à mão, com risco de esquecer uma.