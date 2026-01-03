/**
 * JUI Design Tokens - Premium Edition
 * 
 * Defined in TypeScript for full type safety and dynamic manipulation.
 * Focuses on high-end aesthetics: deep HSL colors, rich elevations, and surface dynamics.
 */

export const colors = {
  brand: {
    primary: 'hsl(250, 89%, 60%)',    // Vibrant Indigo
    primaryLight: 'hsl(250, 89%, 70%)',
    primaryDark: 'hsl(250, 89%, 40%)',
    secondary: 'hsl(330, 81%, 60%)',  // Vibrant Pink/Rose
    secondaryLight: 'hsl(330, 81%, 70%)',
    secondaryDark: 'hsl(330, 81%, 40%)',
    accent: 'hsl(180, 80%, 45%)',     // Cyan/Teal accent
  },
  neutral: {
    white: '#ffffff',
    gray50: 'hsl(210, 40%, 98%)',
    gray100: 'hsl(210, 40%, 96%)',
    gray200: 'hsl(210, 30%, 90%)',
    gray300: 'hsl(210, 20%, 80%)',
    gray400: 'hsl(210, 15%, 65%)',
    gray500: 'hsl(210, 10%, 45%)',
    gray600: 'hsl(210, 10%, 35%)',
    gray700: 'hsl(210, 10%, 20%)',
    gray800: 'hsl(210, 15%, 12%)',
    gray900: 'hsl(210, 20%, 6%)',
    black: '#000000',
  },
  status: {
    success: 'hsl(150, 80%, 40%)',
    warning: 'hsl(40, 90%, 50%)',
    error: 'hsl(0, 85%, 55%)',
    info: 'hsl(200, 85%, 50%)',
  }
};

export const surfaces = {
  glass: 'rgba(255, 255, 255, 0.6)',
  glassDark: 'rgba(15, 23, 42, 0.6)',
  border: 'rgba(255, 255, 255, 0.2)',
  active: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
};

export const spacing = {
  xs: '0.25rem', md: '1rem', lg: '1.5rem', xl: '2.5rem', xxl: '4rem',
};

export const radius = {
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2.5rem',
  full: '9999px',
};

export const shadow = {
  // Advanced multi-layered shadows for premium depth
  sm: '0 2px 4px rgba(0,0,0,0.05)',
  md: '0 8px 16px -4px rgba(0,0,0,0.1), 0 4px 8px -2px rgba(0,0,0,0.06)',
  lg: '0 20px 25px -5px rgba(0,0,0,0.15), 0 10px 10px -5px rgba(0,0,0,0.04)',
  xl: '0 35px 60px -15px rgba(0,0,0,0.3)',
  glow: (color: string) => `0 0 20px ${color}44, 0 0 40px ${color}22`,
};

export const theme = {
  colors,
  surfaces,
  spacing,
  radius,
  shadow,
};

export type JUITheme = typeof theme;
