import React, { useState, useEffect } from 'react';
import { ThemeContext, type Mode } from './ThemeContext';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<Mode>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('skateboard') || path.includes('skate')) {
        return 'skateboard';
      }
      if (path.includes('skiing') || path.includes('ski')) {
        return 'skiing';
      }
    }
    return 'skiing';
  });

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    document.documentElement.className = `theme-${newMode}`;
    if (typeof window !== 'undefined') {
      const targetPath = newMode === 'skateboard' ? '/skateboard' : '/skiing';
      if (window.location.pathname.toLowerCase() !== targetPath) {
        window.history.replaceState({}, '', targetPath);
      }
    }
  };

  const toggleMode = () => {
    setMode(mode === 'skiing' ? 'skateboard' : 'skiing');
  };

  useEffect(() => {
    document.documentElement.className = `theme-${mode}`;

    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('skateboard') || path.includes('skate')) {
        setModeState('skateboard');
        document.documentElement.className = 'theme-skateboard';
      } else {
        setModeState('skiing');
        document.documentElement.className = 'theme-skiing';
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleMode, setMode }}>
      <div className={`theme-${mode}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};


