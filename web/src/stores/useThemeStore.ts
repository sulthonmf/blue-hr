import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: (localStorage.getItem('bluehr_theme') as ThemeMode) || 'light',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('bluehr_theme', newTheme);
    return { theme: newTheme };
  }),
  setTheme: (theme: ThemeMode) => {
    localStorage.setItem('bluehr_theme', theme);
    set({ theme });
  }
}));
