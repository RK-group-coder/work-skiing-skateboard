import React, { useState, useEffect } from 'react';
import { ThemeContext, type Mode } from './ThemeContext';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<Mode>('skiing');

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    document.documentElement.className = `theme-${newMode}`;
  };

  const toggleMode = () => {
    setMode(mode === 'skiing' ? 'skateboard' : 'skiing');
  };

  useEffect(() => {
    document.documentElement.className = `theme-${mode}`;
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleMode, setMode }}>
      <div className={`theme-${mode}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
