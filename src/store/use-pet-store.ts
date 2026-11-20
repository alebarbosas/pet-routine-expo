import { create } from 'zustand';
import { PETS } from '../data/pets';
import type { NovoPet, Pet } from '../types/pet';

type PetStore = {
  pets: Pet[];
  adicionarPet: (novo: NovoPet) => void;
  alternarStatus: (id: string) => void;
  registrarPasseio: (id: string, local?: Pet['local'], fotoUri?: string) => void;
  atualizarFoto: (id: string, fotoUri: string) => void;
  removerPet: (id: string) => void;
  recarregarMock: () => void;
};

export const usePetStore = create<PetStore>((set) => ({
  pets: PETS,

  adicionarPet: (novo) =>
    set((state) => {
      const criado: Pet = {
        ...novo,
        id: `pet-${Date.now()}`,
        statusPasseio: 'pendente',
        criadoEm: new Date(),
      };
      return { pets: [criado, ...state.pets] };
    }),

  alternarStatus: (id) =>
    set((state) => ({
      pets: state.pets.map((p) =>
        p.id === id
          ? {
              ...p,
              statusPasseio: p.statusPasseio === 'concluido' ? 'pendente' : 'concluido',
            }
          : p
      ),
    })),

  registrarPasseio: (id, local, fotoUri) =>
    set((state) => ({
      pets: state.pets.map((p) =>
        p.id === id
          ? {
              ...p,
              statusPasseio: 'concluido',
              local: local ?? p.local,
              fotoUri: fotoUri ?? p.fotoUri,
            }
          : p
      ),
    })),

  atualizarFoto: (id, fotoUri) =>
    set((state) => ({
      pets: state.pets.map((p) => (p.id === id ? { ...p, fotoUri } : p)),
    })),

  removerPet: (id) =>
    set((state) => ({
      pets: state.pets.filter((p) => p.id !== id),
    })),

  recarregarMock: () => set({ pets: PETS }),
}));