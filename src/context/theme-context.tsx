import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ModoTema = 'claro' | 'escuro';

export type PaletaTema = {
  modo: ModoTema;
  fundo: string;
  cartao: string;
  superficie: string;
  texto: string;
  textoFraco: string;
  primaria: string;
  primariaEscura: string;
  primariaSuave: string;
  azulClaro: string;
  azulSuave: string;
  azulTexto: string;
  borda: string;
  sucesso: string;
  alerta: string;
  erro: string;
};

const PALETA_CLARA: PaletaTema = {
  modo: 'claro',
  fundo: '#FAF8F5',        // Off-White quente
  cartao: '#FFFFFF',
  superficie: '#F3EFEA',
  texto: '#2A181B',
  textoFraco: '#6E5A5E',
  primaria: '#722F37',     // Bordô principal
  primariaEscura: '#541E25',
  primariaSuave: '#F5E6E8',
  azulClaro: '#7DD3FC',    // Azul claro destaque
  azulSuave: '#E0F2FE',
  azulTexto: '#0369A1',
  borda: '#E5DDD5',
  sucesso: '#15803D',
  alerta: '#B45309',
  erro: '#B91C1C',
};

const PALETA_ESCURA: PaletaTema = {
  modo: 'escuro',
  fundo: '#171012',        // Vinho escuro harmônico
  cartao: '#24191C',
  superficie: '#2F2125',
  texto: '#FAF8F5',        // Off-White para leitura nítida
  textoFraco: '#C7B8BC',
  primaria: '#9E3E4A',     // Bordô luminoso no escuro
  primariaEscura: '#722F37',
  primariaSuave: '#3B1E23',
  azulClaro: '#7DD3FC',    // Azul claro destaque
  azulSuave: '#132D3E',
  azulTexto: '#7DD3FC',
  borda: '#3E2C31',
  sucesso: '#4ADE80',
  alerta: '#FBBF24',
  erro: '#F87171',
};

const STORAGE_KEY = '@petroutine:theme';

type ThemeContextData = {
  modo: ModoTema;
  tema: PaletaTema;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextData | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [modo, setModo] = useState<ModoTema>('claro');

  useEffect(() => {
    let ativo = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((salvo) => {
        if (!ativo) return;
        if (salvo === 'claro' || salvo === 'escuro') {
          setModo(salvo);
        }
      })
      .catch(() => {});

    return () => {
      ativo = false;
    };
  }, []);

  function toggleTheme() {
    setModo((anterior) => {
      const proximo: ModoTema = anterior === 'claro' ? 'escuro' : 'claro';
      AsyncStorage.setItem(STORAGE_KEY, proximo).catch(() => {});
      return proximo;
    });
  }

  const tema = modo === 'claro' ? PALETA_CLARA : PALETA_ESCURA;

  return (
    <ThemeContext.Provider
      value={{
        modo,
        tema,
        isDark: modo === 'escuro',
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextData {
  const contexto = useContext(ThemeContext);
  if (!contexto) {
    throw new Error('useTheme deve ser usado dentro de um <ThemeProvider>.');
  }
  return contexto;
}