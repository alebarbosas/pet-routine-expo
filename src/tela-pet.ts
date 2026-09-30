// 1) Impede combinações inválidas no layout, como exibir o spinner de carregamento junto com os dados do pet, ou mostrar uma tela de erro sem uma mensagem associada.
// 2) Converte erros de execução em um objeto de estado previsível (EstadoTela), garantindo que a UI apenas reaja a dados e nunca quebre por exceções assíncronas não tratadas.
// 3) Defini NovoPet utilizando Omit<Pet, 'id' | 'criadoEm' | 'statusPasseio'> para impedir no nível do compilador que o formulário envie dados atribuídos exclusivamente pelo servidor.

import type { Pet } from './types/pet';
import { rotuloEspecie, rotuloStatusPasseio } from './types/pet';
import { buscarPetDoUsuario } from './services/petService';

// ============================================================
// P1.2.6 — União discriminada pelo campo `tipo`
// ============================================================
export type EstadoTela<T> =
  | { tipo: 'carregando' }
  | { tipo: 'sucesso'; dados: T }
  | { tipo: 'erro'; mensagem: string };

// ============================================================
// P1.2.7 — Texto de cada estado, switch exaustivo, sem default
// ============================================================
export function descreverTela(estado: EstadoTela<Pet>): string {
  switch (estado.tipo) {
    case 'carregando':
      return 'Carregando…';
    case 'sucesso':
      return `${estado.dados.nome} · ${rotuloEspecie(estado.dados.especie)} · ${rotuloStatusPasseio(estado.dados.statusPasseio)}`;
    case 'erro':
      return `Erro: ${estado.mensagem}`;
  }
}

// ============================================================
// P1.2.8 — Carrega o pet e nunca deixa a exceção escapar
// ============================================================
export async function carregar(): Promise<EstadoTela<Pet>> {
  try {
    const dados = await buscarPetDoUsuario();
    return { tipo: 'sucesso', dados };
  } catch (e) {
    const mensagem = e instanceof Error ? e.message : 'Erro desconhecido';
    return { tipo: 'erro', mensagem };
  }
}

// ============================================================
// VERIFICAÇÃO — não apague
// ============================================================
declare const petExemplo: Pet;

const VERIFICACAO_DE_TIPOS: boolean = false;
if (VERIFICACAO_DE_TIPOS) {
  // DEVEM compilar:
  descreverTela({ tipo: 'carregando' });
  descreverTela({ tipo: 'sucesso', dados: petExemplo });
  descreverTela({ tipo: 'erro', mensagem: 'Sem conexão' });
}


// Rode com `npx tsx src/tela-pet.ts` depois de descomentar:
//carregar().then((estado) => console.log(descreverTela(estado)));