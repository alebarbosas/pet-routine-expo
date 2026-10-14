// ============================================================
// Prática 3 — Mock de dados: lista de pets
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Este arquivo é o mock da lista. No mínimo 20 itens, com:
//   • pelo menos 3 espécies diferentes
//   • todos os 3 status de passeio representados
//   • idades variadas
//   • alguns com local e/ou fotoUri, outros sem
//
// Lista pequena esconde exatamente os problemas que esta prática
// ensina a evitar. Não reduza.
// ============================================================

import type { Pet } from '../types/pet';

// Fotos de mentira: PNGs minúsculos embutidos como data URI, só para exercitar a
// renderização condicional da miniatura SEM depender de rede nem de arquivo no
// cache do aparelho. As fotos reais (tiradas na TelaRegistro) são URIs `file://`.
const FOTO_MOCK_LARANJA =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAEUlEQVR4nGP4vz0NK2IYWhIA5hSHAW6sENcAAAAASUVORK5CYII=';
const FOTO_MOCK_AZUL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAEUlEQVR4nGOYcOonVsQwtCQABO6UwZV5vIcAAAAASUVORK5CYII=';

export const PETS: Pet[] = [
  { id: 'p1', nome: 'Rex', especie: 'cachorro', porte: 'medio', statusPasseio: 'pendente', idadeMeses: 24, criadoEm: new Date('2025-01-15') },
  { id: 'p2', nome: 'Mia', especie: 'gato', porte: 'pequeno', statusPasseio: 'concluido', idadeMeses: 18, criadoEm: new Date('2025-03-10') },
  { id: 'p3', nome: 'Blu', especie: 'ave', porte: 'pequeno', statusPasseio: 'cancelado', idadeMeses: 6, criadoEm: new Date('2025-06-20') },
  {
    // Tem local E foto: testa os dois ramos condicionais do card.
    id: 'p4',
    nome: 'Thor',
    especie: 'cachorro',
    porte: 'grande',
    statusPasseio: 'concluido',
    idadeMeses: 48,
    criadoEm: new Date('2024-11-02'),
    local: { latitude: -7.9407, longitude: -34.8728, precisaoMetros: 12 },
    fotoUri: FOTO_MOCK_LARANJA,
  },
  {
    // Só local, sem foto.
    id: 'p5',
    nome: 'Luna',
    especie: 'gato',
    porte: 'pequeno',
    statusPasseio: 'concluido',
    idadeMeses: 30,
    criadoEm: new Date('2025-02-08'),
    local: { latitude: -8.0476, longitude: -34.877, precisaoMetros: 35 },
  },
  {
    // Só foto, sem local.
    id: 'p6',
    nome: 'Bidu',
    especie: 'cachorro',
    porte: 'pequeno',
    statusPasseio: 'concluido',
    idadeMeses: 9,
    criadoEm: new Date('2025-07-14'),
    fotoUri: FOTO_MOCK_AZUL,
  },
  { id: 'p7', nome: 'Nina', especie: 'cachorro', porte: 'medio', statusPasseio: 'pendente', idadeMeses: 60, criadoEm: new Date('2023-09-21') },
  { id: 'p8', nome: 'Simba', especie: 'gato', porte: 'medio', statusPasseio: 'pendente', idadeMeses: 12, criadoEm: new Date('2025-04-03') },
  { id: 'p9', nome: 'Piu', especie: 'ave', porte: 'pequeno', statusPasseio: 'pendente', idadeMeses: 3, criadoEm: new Date('2025-08-30') },
  { id: 'p10', nome: 'Mel', especie: 'cachorro', porte: 'pequeno', statusPasseio: 'cancelado', idadeMeses: 84, criadoEm: new Date('2022-05-17') },
  { id: 'p11', nome: 'Zeca', especie: 'outro', porte: 'pequeno', statusPasseio: 'pendente', idadeMeses: 20, criadoEm: new Date('2025-01-29') },
  { id: 'p12', nome: 'Frida', especie: 'gato', porte: 'pequeno', statusPasseio: 'cancelado', idadeMeses: 96, criadoEm: new Date('2021-12-11') },
  { id: 'p13', nome: 'Bolt', especie: 'cachorro', porte: 'grande', statusPasseio: 'pendente', idadeMeses: 15, criadoEm: new Date('2025-05-06') },
  { id: 'p14', nome: 'Cacau', especie: 'cachorro', porte: 'medio', statusPasseio: 'concluido', idadeMeses: 36, criadoEm: new Date('2024-02-19') },
  { id: 'p15', nome: 'Pipoca', especie: 'outro', porte: 'pequeno', statusPasseio: 'concluido', idadeMeses: 8, criadoEm: new Date('2025-06-02') },
  { id: 'p16', nome: 'Amora', especie: 'gato', porte: 'pequeno', statusPasseio: 'pendente', idadeMeses: 5, criadoEm: new Date('2025-09-12') },
  { id: 'p17', nome: 'Apolo', especie: 'cachorro', porte: 'grande', statusPasseio: 'cancelado', idadeMeses: 72, criadoEm: new Date('2022-10-08') },
  { id: 'p18', nome: 'Kiwi', especie: 'ave', porte: 'pequeno', statusPasseio: 'concluido', idadeMeses: 14, criadoEm: new Date('2025-03-25') },
  { id: 'p19', nome: 'Princesa', especie: 'cachorro', porte: 'pequeno', statusPasseio: 'pendente', idadeMeses: 108, criadoEm: new Date('2020-08-14') },
  { id: 'p20', nome: 'Garfield', especie: 'gato', porte: 'grande', statusPasseio: 'concluido', idadeMeses: 42, criadoEm: new Date('2024-01-07') },
  { id: 'p21', nome: 'Bento', especie: 'cachorro', porte: 'medio', statusPasseio: 'pendente', idadeMeses: 2, criadoEm: new Date('2025-09-20') },
  { id: 'p22', nome: 'Ágata', especie: 'ave', porte: 'pequeno', statusPasseio: 'pendente', idadeMeses: 26, criadoEm: new Date('2024-12-01') },
];