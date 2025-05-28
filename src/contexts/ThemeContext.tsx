
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
export type Font = 'geist-mono' | 'geist-sans' | 'satoshi' | 'kalam' | 'indie-flower' | 'lancelot' | 'cormorant-upright'; // Updated fonts

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  font: Font;
  setFont: (font: Font) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const localTheme = localStorage.getItem('braindump-theme') as Theme | null;
    return localTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });
  const [font, setFontState] = useState<Font>(() => {
    return (localStorage.getItem('braindump-font') as Font | null) || 'geist-mono'; // Default to Geist Mono
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('braindump-theme', theme);
  }, [theme]);

  useEffect(() => {
    const body = window.document.body;
    const html = window.document.documentElement;
    // Updated font list
    ['font-geist-mono', 'font-geist-sans', 'font-kalam', 'font-indie-flower', 'font-lancelot', 'font-cormorant-upright', 'font-satoshi'].forEach(cls => {
      body.classList.remove(cls);
      html.classList.remove(cls);
    });
    body.classList.add(`font-${font}`);
    html.classList.add(`font-${font}`);
    localStorage.setItem('braindump-font', font);
  }, [font]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const setFont = (newFont: Font) => {
    setFontState(newFont);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, font, setFont, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
