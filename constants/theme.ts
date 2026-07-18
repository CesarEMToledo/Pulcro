import { scaleFont, scaleSpacing } from './responsive';

export const Colors = {
  primary: '#1A6FD4',
  primaryLight: '#4A90E2',
  primaryDark: '#0D4FA0',
  secondary: '#2ABFBF',
  secondaryLight: '#4DD9D9',
  secondaryDark: '#1A9A9A',
  accent: '#00D4AA',
  background: '#FFFFFF',
  surface: '#F5F7FA',
  surfaceElevated: '#EAEFF5',
  textPrimary: '#2C3444',
  textSecondary: '#5A6478',
  textMuted: '#9BA5B7',
  border: '#E2E8F0',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  white: '#FFFFFF',
  black: '#000000',
  gradientStart: '#1A6FD4',
  gradientEnd: '#2ABFBF',
};

// Base spacing/radius/font values are scaled once at module load based on the
// device's screen width (see constants/responsive.ts), so every screen that
// already consumes these design tokens becomes responsive automatically —
// larger on tablets, gently smaller on compact phones — without needing to
// touch each individual style declaration across the app.
export const Spacing = {
  xs: scaleSpacing(4),
  sm: scaleSpacing(8),
  md: scaleSpacing(16),
  lg: scaleSpacing(24),
  xl: scaleSpacing(32),
  xxl: scaleSpacing(48),
};

export const Radius = {
  sm: scaleSpacing(8),
  md: scaleSpacing(12),
  lg: scaleSpacing(16),
  xl: scaleSpacing(24),
  full: 999,
};

export const FontSize = {
  xs: scaleFont(11),
  sm: scaleFont(13),
  md: scaleFont(15),
  lg: scaleFont(17),
  xl: scaleFont(20),
  xxl: scaleFont(24),
  xxxl: scaleFont(30),
};

export const Layout = {
  maxContentWidth: 560,
};

export const Shadow = {
  sm: {
    shadowColor: '#1A6FD4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  md: {
    shadowColor: '#1A6FD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  lg: {
    shadowColor: '#1A6FD4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 10,
  },
};
