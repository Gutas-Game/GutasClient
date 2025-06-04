import { createContext, useContext, useState, useEffect } from 'react';

const themes = {
  light: {
    name: 'Light',
    colors: {
      primary: '#1976d2',
      secondary: '#dc004e',
      background: '#ffffff',
      surface: '#f5f5f5',
      text: '#000000',
      textSecondary: '#666666',
      border: '#e0e0e0',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      cardBackground: 'rgba(255, 255, 255, 0.1)'
    }
  },
  dark: {
    name: 'Dark',
    colors: {
      primary: '#90caf9',
      secondary: '#f48fb1',
      background: '#121212',
      surface: '#1e1e1e',
      text: '#ffffff',
      textSecondary: '#b0b0b0',
      border: '#333333',
      success: '#66bb6a',
      warning: '#ffb74d',
      error: '#ef5350',
      gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      cardBackground: 'rgba(0, 0, 0, 0.3)'
    }
  }
};

const ThemeContext = createContext();

// Hook untuk menggunakan theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Provider component
export const ThemeProvider = ({ children }) => {
  // Load theme dari localStorage atau default ke 'light'
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('rps-theme');
    return savedTheme && themes[savedTheme] ? savedTheme : 'light';
  });

  // Update CSS variables ketika theme berubah
  useEffect(() => {
    const theme = themes[currentTheme];
    if (theme) {
      const root = document.documentElement;
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });
    }
  }, [currentTheme]);

  // Save theme ke localStorage
  useEffect(() => {
    localStorage.setItem('rps-theme', currentTheme);
  }, [currentTheme]);

  // Function untuk mengganti theme
  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  // Function untuk cycle theme
  const cycleTheme = () => {
    const themeKeys = Object.keys(themes);
    const currentIndex = themeKeys.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setCurrentTheme(themeKeys[nextIndex]);
  };

  // Function untuk mendapatkan list available themes
  const getAvailableThemes = () => {
    return Object.entries(themes).map(([key, theme]) => ({
      key,
      name: theme.name
    }));
  };

  const value = {
    theme: themes[currentTheme],
    currentTheme,
    changeTheme,
    cycleTheme,
    getAvailableThemes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
