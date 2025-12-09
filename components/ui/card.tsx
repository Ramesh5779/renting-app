import { Animations, BorderRadius, Gradients, Shadows, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, type PressableProps } from 'react-native';
import { ThemedView } from '../themed-view';

export type CardProps = PressableProps & {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'glass' | 'outlined' | 'gradient';
  padding?: 'none' | 'small' | 'medium' | 'large';
  pressable?: boolean;
  rounded?: boolean;
};

export function Card({
  children,
  variant = 'elevated',
  padding = 'medium',
  pressable = false,
  rounded = true,
  style,
  ...rest
}: CardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const backgroundColor = useThemeColor({}, 'backgroundElevated');
  const borderColor = useThemeColor({}, 'border');
  const rippleColor = useThemeColor({}, 'ripple');
  const cardHoverColor = useThemeColor({}, 'cardHover');

  const getPaddingStyle = () => {
    switch (padding) {
      case 'none':
        return {};
      case 'small':
        return { padding: Spacing.md };
      case 'medium':
        return { padding: Spacing.lg };
      case 'large':
        return { padding: Spacing.xl };
    }
  };

  const getCardStyle = () => {
    const baseStyle = {
      borderRadius: rounded ? BorderRadius.card : 0,
      overflow: 'hidden' as const,
      ...getPaddingStyle(),
    };

    const variantStyles = {
      default: {
        backgroundColor: backgroundColor,
      },
      elevated: {
        backgroundColor: backgroundColor,
        ...Shadows.card,
      },
      glass: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
        ...Shadows.card,
      },
      outlined: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: borderColor,
      },
      gradient: {
        // Gradient handled by LinearGradient wrapper
        ...Shadows.card,
      },
    };

    return [baseStyle, variantStyles[variant]];
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      ...Animations.spring,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      ...Animations.spring,
    }).start();
  };

  const CardContent = () => (
    <>
      {variant === 'gradient' && (
        <LinearGradient
          colors={Gradients.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      {children}
    </>
  );

  if (pressable) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          style={(state) => {
            const userStyle = typeof style === 'function' ? style(state) : style;
            return [
              getCardStyle(),
              state.pressed && variant !== 'gradient' && { backgroundColor: cardHoverColor },
              userStyle,
            ];
          }}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          android_ripple={{ color: rippleColor, borderless: false }}
          {...rest}
        >
          <CardContent />
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <ThemedView style={[getCardStyle(), style as any]}>
      <CardContent />
    </ThemedView>
  );
}