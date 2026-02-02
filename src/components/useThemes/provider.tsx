"use client"; 

import { useEffect } from 'react';
import { useTheme } from './useThemes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
}