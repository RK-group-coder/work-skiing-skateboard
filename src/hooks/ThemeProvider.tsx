import React, { useState, useEffect } from 'react';
import { ThemeContext, type Mode } from './ThemeContext';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<Mode>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get('mode');
      if (modeParam === 'skateboard' || modeParam === 'skiing') {
        return modeParam;
      }
      const path = window.location.pathname.toLowerCase();
      if (path.includes('skateboard')) return 'skateboard';
      if (path.includes('skiing')) return 'skiing';
    }
    return 'skiing';
  });

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    document.documentElement.className = `theme-${newMode}`;
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('mode', newMode);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const toggleMode = () => {
    setMode(mode === 'skiing' ? 'skateboard' : 'skiing');
  };

  useEffect(() => {
    document.documentElement.className = `theme-${mode}`;

    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get('mode');
      if (modeParam === 'skateboard' || modeParam === 'skiing') {
        setModeState(modeParam);
        document.documentElement.className = `theme-${modeParam}`;
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

