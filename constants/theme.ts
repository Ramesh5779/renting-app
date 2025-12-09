/**
 * Below are the colors that are used in the app. Black and white monochrome theme only.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Premium Monochrome Design System - Airbnb/Apple Style (Black and White Only)
const tintColor = '#000000';

export const Colors = {
  // Text colors - True black for premium contrast
  text: '#000000',
  textSecondary: '#4B5563', // Darker grey for better readability
  textTertiary: '#6B7280', // Medium grey

  // Background colors - Pure luxury whites
  background: '#FFFFFF',
  backgroundElevated: '#FFFFFF',
  backgroundSecondary: '#F8F9FA', // Subtle off-white
  backgroundOverlay: 'rgba(255, 255, 255, 0.95)', // Frosted glass effect

  // UI elements
  tint: tintColor,
  primary: '#000000',
  secondary: '#4B5563',
  accent: '#FF385C', // Airbnb-style accent for hearts/favorites
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',

  // Borders and dividers
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderStrong: '#000000',

  // Icons
  icon: '#4B5563',
  iconActive: '#000000',
  tabIconDefault: '#6B7280',
  tabIconSelected: '#000000',

  // Interactive states
  ripple: 'rgba(0, 0, 0, 0.08)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  cardHover: 'rgba(0, 0, 0, 0.03)',
};

export const Gradients = {
  primary: ['#000000', '#333333'] as const,
  secondary: ['#F3F4F6', '#E5E7EB'] as const,
  accent: ['#FF385C', '#E31C5F'] as const,
  card: ['#FFFFFF', '#F9FAFB'] as const,
  background: ['#FFFFFF', '#F8F9FA'] as const,
};

// Premium Typography Scale - Modern & Clean
export const Typography = {
  // Hero & Display
  hero: {
    fontSize: 36,
    fontWeight: '800' as const,
    lineHeight: 42,
    letterSpacing: -1,
  },

  // Headings - Bold & Modern
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 30,
    letterSpacing: -0.25,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 26,
    letterSpacing: -0.1,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  h5: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
  },

  // Body text - Clean & Readable
  bodyLarge: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 26,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },

  // UI Elements
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    letterSpacing: 0.3,
  },
  overline: {
    fontSize: 11,
    fontWeight: '600' as const,
    lineHeight: 14,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  price: {
    fontSize: 18,
    fontWeight: '700' as const,
    lineHeight: 24,
    letterSpacing: -0.1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500' as const,
    lineHeight: 24,
    letterSpacing: 0.1,
  },
  link: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 20,
    letterSpacing: 0.1,
    textDecorationLine: 'underline',
  },
};

// Premium Spacing System - Apple/Airbnb Style
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  massive: 64,
};

// Modern Border Radius - Soft & Premium
export const BorderRadius = {
  xs: 4,
  sm: 6,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 999,
  card: 16, // Standard card radius
  button: 12, // Button radius
  input: 12, // Input field radius
};

// Premium Shadows - Soft & Luxurious
export const Shadows = {
  // Subtle shadows for cards
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  // Medium elevation for modals/overlays
  modal: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },

  // Floating action buttons
  fab: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },

  // Input focus state
  input: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },

  // Tab bar
  tabBar: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Frosted Glass Effects
export const GlassEffects = {
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
  },
  dark: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(20px)',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(10px)',
  },
};

// Animation Durations
export const Animations = {
  fast: 150,
  normal: 250,
  slow: 400,
  spring: {
    damping: 20,
    stiffness: 300,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
