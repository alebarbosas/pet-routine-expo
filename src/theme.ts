// ============================================================
// Prática 2 — Sistema de tokens de design
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Tokens são VALORES (cores, espaçamentos, tipografia), nunca
// layouts prontos. Componentes consomem estes tokens — nunca o
// contrário. Nenhum componente deve ter um hex ou número mágico;
// tudo vem daqui.
//
// Regra: `as const` AQUI, nunca dentro de `StyleSheet.create`.
// ============================================================

export const cores = {
  fundo: '#FEF7EE',
  cartao: '#FFFFFF',
  texto: '#333333',
  textoFraco: '#777777',
  textoInverso: '#FFFFFF', // texto sobre fundo `primaria` / `textoFraco`
  primaria: '#FF8C00',
  sucesso: '#4CAF50',
  erro: '#F44336',
} as const;

export const espaco = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const tipografia = {
  titulo: { fontSize: 24, fontWeight: '600', color: cores.texto },
  corpo: { fontSize: 16, fontWeight: '400', color: cores.texto },
  legenda: { fontSize: 12, fontWeight: '400', color: cores.textoFraco },
} as const;

// Medidas de layout e de toque (Prática 3). Também são tokens: nenhum
// número mágico dentro de componente.
export const layout = {
  topoTela: 48, // folga para a barra de status, já que não usamos SafeArea ainda
  alturaMiniatura: 120, // miniatura no card
  alturaPrevia: 200, // prévia da foto na tela de registro
  bordaDestaque: 2, // borda do Card destacado
} as const;

// Sombra como string única, para `boxShadow` (nada de shadow* + elevation).
export const sombra = {
  card: '0 2px 4px rgba(0,0,0,0.1)',
} as const;

export const toque = {
  // Ampliação da área de toque do item. Precisa ser MENOR que o gap da lista
  // (espaco.sm = 8), senão a área de um item invade a do vizinho.
  hitSlop: espaco.xs,
  // Atraso antes do feedback visual `pressed`. Evita o "piscar" quando o dedo
  // só está iniciando uma rolagem. 100 ms fica abaixo do limiar de percepção
  // de lentidão e acima do tempo típico de início de um scroll.
  atrasoFeedbackMs: 100,
  opacidadePressionado: 0.7,
} as const;

// `as const` fica AQUI porque os tokens precisam de tipos literais
// (ex.: fontWeight '600', e não `string`) para serem aceitos pelo tipo de estilo
// do React Native. Já o StyleSheet.create() recebe o objeto num parâmetro
// genérico que já preserva os literais — o `as const` ali seria ruído.