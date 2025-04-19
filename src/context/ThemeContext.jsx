import { createContext, useContext, useState, useEffect } from 'react';

// Create context with a default undefined value
const ThemeContext = createContext(undefined);

// Custom hook for using the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme provider component that will wrap our app
export const ThemeProvider = ({ children }) => {
  // Get the initial theme from localStorage if available, otherwise use system preference
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light'; // Default to light mode
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const [isMounted, setIsMounted] = useState(false);

  // Toggle between light and dark theme
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Set a specific theme
  const setThemeMode = (mode) => {
    if (mode === 'light' || mode === 'dark') {
      setTheme(mode);
    }
  };

  // Effect to handle theme changes and apply to document
  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
      return;
    }

    // Save theme to localStorage
    localStorage.setItem('theme', theme);
    
    // Apply theme to document
    const root = window.document.documentElement;
    
    // Remove old theme class
    if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    
    // Set CSS variables for theme colors
    if (theme === 'dark') {
      root.style.setProperty('--bg-primary', '#121212');
      root.style.setProperty('--bg-secondary', '#1e1e1e');
      root.style.setProperty('--text-primary', '#f8f9fa');
      root.style.setProperty('--text-secondary', '#d1d1d1');
      root.style.setProperty('--accent-color', '#90caf9');
      root.style.setProperty('--border-color', '#333333');
      root.style.setProperty('--card-bg', '#252525');
      root.style.setProperty('--input-bg', '#333333');
      root.style.setProperty('--button-bg', '#0d47a1');
      root.style.setProperty('--button-text', '#ffffff');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.5)');
    } else {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8f9fa');
      root.style.setProperty('--text-primary', '#212121');
      root.style.setProperty('--text-secondary', '#666666');
      root.style.setProperty('--accent-color', '#1976d2');
      root.style.setProperty('--border-color', '#e0e0e0');
      root.style.setProperty('--card-bg', '#ffffff');
      root.style.setProperty('--input-bg', '#f5f5f5');
      root.style.setProperty('--button-bg', '#1976d2');
      root.style.setProperty('--button-text', '#ffffff');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)');
    }
  }, [theme, isMounted]);

  // Handle system preference changes
  useEffect(() => {
    if (!window.matchMedia) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      // Only change theme if user hasn't explicitly set a preference
      if (!localStorage.getItem('theme')) {
        setTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };
    
    // Modern approach with addEventListener
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Prevent SSR issues by checking if we're in the browser
  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;