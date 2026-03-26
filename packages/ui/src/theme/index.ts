/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Color palette - matching Netflix-style dark theme
export const colors = {
  // Background colors
  background: '#141414',
  backgroundLight: '#1f1f1f',
  backgroundLighter: '#2a2a2a',
  
  // Surface colors
  surface: '#000000',
  surfaceElevated: '#181818',
  surfaceOverlay: '#242424',
  
  // Primary colors (Netflix red)
  primary: '#e50914',
  primaryDark: '#b20710',
  primaryLight: '#f40612',
  
  // Accent colors
  accent: '#ffffff',
  accentMuted: '#b3b3b3',
  accentDim: '#808080',
  
  // Text colors
  textPrimary: '#ffffff',
  textSecondary: '#b3b3b3',
  textMuted: '#808080',
  textDisabled: '#4d4d4d',
  
  // Semantic colors
  success: '#46d369',
  warning: '#ffa00a',
  error: '#e50914',
  info: '#0071eb',
  
  // Gradient colors
  gradient: {
    start: 'rgba(0, 0, 0, 0)',
    end: 'rgba(0, 0, 0, 0.9)',
    primary: 'linear-gradient(to top, #141414 0%, transparent 100%)',
    hero: 'linear-gradient(to top, #141414 10%, transparent 90%)',
  },
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.4)',
} as const;

// Typography
export const typography = {
  fontFamily: {
    primary: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },
  
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// Spacing scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
} as const;

// Border radius
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// Shadows
export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.5)',
  md: '0 4px 6px rgba(0, 0, 0, 0.5)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.5)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.5)',
} as const;

// Breakpoints (for responsive design)
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Z-index scale
export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  modal: 300,
  popover: 400,
  tooltip: 500,
} as const;

// Animation durations
export const duration = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// Theme object for export
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  zIndex,
  duration,
} as const;

export type Theme = typeof theme;