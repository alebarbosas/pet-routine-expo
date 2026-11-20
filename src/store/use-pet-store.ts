import { create } from 'zustand';
import { apiFetch } from '../services/api';
import type { AtualizacaoPet, NovoPet, Pet } from '../types/pet';

type PetStore = {
  pets: Pet[];
  isLoading: boolean;
  error: string | null;
  fetchPets: () => Promise<void>;
  addPet: (novo: NovoPet) => Promise<void>;
  togglePasseio: (id: string) => Promise<void>;
  registrarPasseio: (
    id: string,
    local?: Pet['local'],
    fotoUri?: string
  ) => Promise<void>;
  updatePet: (id: string, dados: AtualizacaoPet) => Promise<void>;
  removePet: (id: string) => Promise<void>;
  clearPets: () => void;
};

export const usePetStore = create<PetStore>((set) => ({
  pets: [],
  isLoading: false,
  error: null,

  fetchPets: async () => {
    set({ isLoading: true, error: null });
    try {
      const lista = await apiFetch<Pet[]>('/pets');
      set({ pets: lista, isLoading: false });
    } catch (err) {
      set({
        error:
          err instanceof Error ? err.message : 'Erro ao carregar lista de pets.',
        isLoading: false,
      });
    }
  },

  addPet: async (novo) => {
    set({ isLoading: true, error: null });
    try {
      const criado = await apiFetch<Pet>('/pets', {
        method: 'POST',
        body: JSON.stringify(novo),
      });
      set((state) => ({
        pets: [criado, ...state.pets],
        isLoading: false,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Erro ao cadastrar pet.',
        isLoading: false,
      });
      throw err;
    }
  },

  togglePasseio: async (id) => {
    set({ error: null });
    try {
      const atualizado = await apiFetch<Pet>(`/pets/${id}/toggle`, {
        method: 'PATCH',
      });
      set((state) => ({
        pets: state.pets.map((p) => (p.id === id ? atualizado : p)),
      }));
    } catch (err) {
      set({
        error:
          err instanceof Error
            ? err.message
            : 'Erro ao alternar status do passeio.',
      });
      throw err;
    }
  },

  registrarPasseio: async (id, local, fotoUri) => {
    set({ error: null });
    try {
      const atualizado = await apiFetch<Pet>(`/pets/${id}/passeio`, {
        method: 'PATCH',
        body: JSON.stringify({
          statusPasseio: 'concluido',
          local,
          fotoUri,
        }),
      });
      set((state) => ({
        pets: state.pets.map((p) => (p.id === id ? atualizado : p)),
      }));
    } catch (err) {
      set({
        error:
          err instanceof Error ? err.message : 'Erro ao registrar passeio.',
      });
      throw err;
    }
  },

  updatePet: async (id, dados) => {
    set({ error: null });
    try {
      const atualizado = await apiFetch<Pet>(`/pets/${id}`, {
        method: 'PUT',
        body: JSON.stringify(dados),
      });
      set((state) => ({
        pets: state.pets.map((p) => (p.id === id ? atualizado : p)),
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Erro ao atualizar pet.',
      });
      throw err;
    }
  },

  removePet: async (id) => {
    set({ error: null });
    try {
      await apiFetch<void>(`/pets/${id}`, {
        method: 'DELETE',
      });
      set((state) => ({
        pets: state.pets.filter((p) => p.id !== id),
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Erro ao remover pet.',
      });
      throw err;
    }
  },

  clearPets: () => set({ pets: [], error: null }),
}));