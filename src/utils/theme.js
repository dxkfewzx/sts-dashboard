/**
 * Theme Utilities - Light Mode Only (matching sts-test)
 * No dark mode support
 */


/**
 * Get current theme - always returns 'light'
 * @returns {'light'}
 */
export const getCurrentTheme = () => {
  return 'light';
};

/**
 * Apply theme to document - no-op since only light mode
 * @param {'light'} theme
 */
export const applyTheme = (theme) => {
  // No-op: only light mode supported
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.classList.remove('dark-mode');
    root.removeAttribute('data-theme');
  }
};

/**
 * Toggle theme - no-op since only light mode
 * @returns {'light'}
 */
export const toggleTheme = () => {
  return 'light';
};

/**
 * Set specific theme - only accepts 'light'
 * @param {'light'} theme
 */
export const setTheme = (theme) => {
  // Only light mode supported
  if (theme !== 'light') return;
};

/**
 * Initialize theme on app startup - always applies light mode
 * Call this once in your App.js or index.js
 */
export const initTheme = () => {
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.classList.remove('dark-mode');
    root.removeAttribute('data-theme');
  }
  return 'light';
};

/**
 * React hook for theme management (light mode only)
 * Usage: const { theme } = useTheme();
 */
export const useTheme = () => {
  return {
    theme: 'light',
    getCurrentTheme,
    toggleTheme: () => 'light',
    setTheme: () => {},
    initTheme,
  };
};

const themeUtils = {
  getCurrentTheme,
  applyTheme,
  toggleTheme,
  setTheme,
  initTheme,
  useTheme,
};

export default themeUtils;
