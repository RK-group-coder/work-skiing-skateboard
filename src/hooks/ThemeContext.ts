import { createContext } from 'react';

export type Mode = 'skiing' | 'skateboard';

export interface ThemeContextType {
  mode: Mode;
  toggleMode: () => void;
  setMode: (mode: Mode) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
