import localFont from 'next/font/local';

/**
 * Fonts are shipped locally (no build-time Google Fonts fetch, works in offline/regional Docker
 * builds). Each exposes a CSS variable; `globals.css` picks the stack per language.
 */
export const vazirmatn = localFont({
  src: '../../public/fonts/Vazirmatn-Variable.woff2',
  variable: '--font-vazirmatn',
  weight: '100 900',
  display: 'swap',
});

export const inter = localFont({
  src: '../../public/fonts/Inter-Variable.woff2',
  variable: '--font-inter',
  weight: '100 900',
  display: 'swap',
});

export const fontVariables = `${vazirmatn.variable} ${inter.variable}`;
