import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
    theme: ThemeMode;
    toggleTheme: () => void;
    setTheme: (theme: ThemeMode) => void;
    initializeTheme: () => void;
}

/**
 * Apply the theme class to the <html> element and update localStorage.
 */
function applyTheme(theme: ThemeMode) {
    const root = document.documentElement;
    if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
    } else {
        root.classList.add('light');
        root.classList.remove('dark');
    }
    localStorage.setItem('hashtribe-theme', theme);
}

/**
 * Get the initial theme from localStorage or system preference.
 */
function getInitialTheme(): ThemeMode {
    // Check localStorage first
    const stored = localStorage.getItem('hashtribe-theme') as ThemeMode | null;
    if (stored === 'light' || stored === 'dark') {
        return stored;
    }
    // Fall back to system preference
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)').matches) {
        return 'light';
    }
    return 'dark';
}

export const useThemeStore = create<ThemeState>((set, get) => ({
    theme: 'dark', // Default, overridden by initializeTheme

    toggleTheme: () => {
        const newTheme: ThemeMode = get().theme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        set({ theme: newTheme });
    },

    setTheme: (theme: ThemeMode) => {
        applyTheme(theme);
        set({ theme });
    },

    initializeTheme: () => {
        const theme = getInitialTheme();
        applyTheme(theme);
        set({ theme });
    },
}));
