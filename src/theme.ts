export const cores = {
  // Off-White (fundos e superfícies)
  fundo: '#FAF8F5',        // Off-White quente (fundo principal das telas)
  cartao: '#FFFFFF',       // Branco puro para contraste nos cartões
  superficie: '#F3EFEA',   // Off-White acinzentado para áreas secundárias

  // Textos
  texto: '#2A181B',        // Texto principal (vinho bem escuro para leitura confortável)
  textoFraco: '#6E5A5E',   // Texto secundário / legendas

  // Bordô (cor primária da marca)
  primaria: '#722F37',     // Bordô clássico (cabeçalhos, botões principais, aba ativa)
  primariaEscura: '#541E25',
  primariaSuave: '#F5E6E8',

  // Azul Claro (cor secundária de destaque e seleção)
  secundaria: '#7DD3FC',   // Azul céu claro (bordas ativas, detalhes e links no escuro)
  azulClaro: '#7DD3FC',
  azulSuave: '#E0F2FE',    // Azul gelo (fundo de chips ativos e caixas de aviso)
  azulTexto: '#0369A1',    // Azul petróleo (texto legível sobre o azul suave)

  // Bordas e estados semânticos
  borda: '#E5DDD5',
  sucesso: '#15803D',
  alerta: '#B45309',
  erro: '#B91C1C',
} as const;

export const espaco = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const tipografia = {
  titulo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2A181B',
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A181B',
  },
  corpo: {
    fontSize: 15,
    color: '#2A181B',
  },
  legenda: {
    fontSize: 13,
    color: '#6E5A5E',
  },
} as const;