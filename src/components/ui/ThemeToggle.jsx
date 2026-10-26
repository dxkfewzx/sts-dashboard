import React, { useState, useEffect } from 'react';
import Button from './Button';
import { getCurrentTheme, applyTheme, toggleTheme } from '../../utils/theme';

/**
 * Theme Toggle Button
 * Allows users to switch between light and dark mode
 */
const ThemeToggle = ({ 
  variant = 'outline', 
  size = 'sm',
  showLabel = false,
  className = '' 
}) => {
  const [theme, setTheme] = useState(() => getCurrentTheme());

  useEffect(() => {
    // Initialize theme on mount
    const currentTheme = getCurrentTheme();
    setTheme(currentTheme);
    applyTheme(currentTheme);

    // Listen for storage changes (from other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'sts-dashboard-theme') {
        const newTheme = e.newValue;
        if (newTheme === 'light' || newTheme === 'dark') {
          setTheme(newTheme);
          applyTheme(newTheme);
        }
      }
    };

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e) => {
      const stored = localStorage.getItem('sts-dashboard-theme');
      if (!stored) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener?.('change', handleSystemChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      mediaQuery.removeEventListener?.('change', handleSystemChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleToggle = () => {
    const newTheme = toggleTheme();
    setTheme(newTheme);
  };

  const icons = {
    light: 'bi bi-sun-fill',
    dark: 'bi bi-moon-stars-fill',
  };

  const labels = {
    light: 'โหมดสว่าง',
    dark: 'โหมดมืด',
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      aria-label={`สลับเป็น${theme === 'light' ? 'โหมดมืด' : 'โหมดสว่าง'}`}
      title={`สลับเป็น${theme === 'light' ? 'โหมดมืด' : 'โหมดสว่าง'}`}
      className={className}
    >
      <i className={icons[theme]} aria-hidden="true" />
      {showLabel && <span className="ms-1">{labels[theme]}</span>}
    </Button>
  );
};

ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;
