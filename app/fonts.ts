import localFont from 'next/font/local'

/**
 * Self-hosted fonts via next/font/local using the variable TTFs in public/fonts.
 *
 * Previously loaded via next/font/google, which fetches the WOFF2s from Google
 * at BUILD time. When that fetch can't complete (restricted/offline build, TLS
 * interception), next/font silently emits only its metric-adjusted *fallback*
 * font — so the whole site renders in a system sans-serif instead of Space
 * Grotesk / Inter. Loading the files that already live in the repo removes that
 * build-time network dependency entirely: the fonts always load.
 *
 * Same CSS variable names as before (--font-space-grotesk / --font-inter), so
 * globals.css tokens and layout.tsx need no changes.
 */

export const spaceGrotesk = localFont({
  src: '../public/fonts/SpaceGrotesk-VariableFont_wght.ttf',
  weight: '300 700', // variable weight axis
  display: 'swap',
  variable: '--font-space-grotesk',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
})

export const inter = localFont({
  src: '../public/fonts/Inter-VariableFont_opsz,wght.ttf',
  weight: '100 900', // variable weight axis
  display: 'swap',
  variable: '--font-inter',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
})
