import { useState, useEffect, useCallback } from 'react';

export type ThemeName = 'light' | 'dark';
export const THEME_STORAGE_KEY = 'theme';

/** Client-side theme state. The initial value is applied by the inline script in the root layout. */
export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeName>('light');

  useEffect(() => {
    // localStorage is only readable after mount; reading it during render would break hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  }, []);

  const setAndPersist = useCallback((next: ThemeName) => {
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
  }, []);

  const toggle = useCallback(
    () => setAndPersist(theme === 'dark' ? 'light' : 'dark'),
    [theme, setAndPersist]
  );

  return { theme, isDark: theme === 'dark', setTheme: setAndPersist, toggle };
};

export default useTheme;
