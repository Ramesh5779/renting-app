import { Animations, BorderRadius, Colors, Gradients, Shadows, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef } from 'react';
import { ActivityIndicator, Animated, Platform, Pressable, StyleSheet, View, type PressableProps } from 'react-native';
import { ThemedText } from '../themed-text';

export type ButtonProps = PressableProps & {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
  rounded?: boolean;
};

export function Button({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  rounded = true,
  style,
  disabled,
  ...rest
}: ButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const primaryColor = useThemeColor({}, 'primary');
  const rippleColor = useThemeColor({}, 'ripple');

  const getButtonStyle = () => {
    const baseStyle = {
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderRadius: rounded ? BorderRadius.button : 0,
      flexDirection: 'row' as const,
      overflow: 'hidden' as const,
      ...(fullWidth && { width: '100%' as const }),
    };

    const sizeStyles = {
      small: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        minHeight: 40,
      },
      medium: {
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        minHeight: 48,
      },
      large: {
        paddingHorizontal: Spacing.xxl,
        paddingVertical: Spacing.xl,
        minHeight: 56,
      },
    };

    const variantStyles = {
      primary: {
        borderWidth: 0,
        ...Shadows.fab,
      },
      secondary: {
        backgroundColor: Colors.backgroundSecondary,
        borderWidth: 1.5,
        borderColor: Colors.border,
        ...Shadows.input,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: primaryColor,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderWidth: 0,
      },
      destructive: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#000000',
      },
    };

    return [
      baseStyle,
      sizeStyles[size],
      variantStyles[variant],
      disabled && { opacity: 0.4 },
    ];
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return '#FFFFFF'; // Always white on gradient primary buttons
      case 'secondary':
        return '#000000'; // Explicit black for visibility
      case 'outline':
        return primaryColor;
      case 'ghost':
        return primaryColor;
      case 'destructive':
        return '#000000';
      default:
        return primaryColor;
    }
  };

  const getTextType = () => {
    return size === 'small' ? 'bodySmall' : 'body';
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
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

  const ButtonContent = () => (
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getTextColor()}
          style={{ marginRight: Spacing.sm }}
          testID="activity-indicator"
        />
      ) : null}
      <ThemedText
        type={getTextType()}
        style={{
          color: getTextColor(),
          fontWeight: '600',
          lineHeight: size === 'small' ? 18 : 22, // Match Typography line heights
          fontFamily: Platform.OS === 'android' ? 'sans-serif' : undefined, // Explicit font for Android
          ...(loading && { marginLeft: Spacing.sm })
        }}
        {...(Platform.OS === 'android' && { textBreakStrategy: 'simple' })}
      >
        {title}
      </ThemedText>
    </View>
  );

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, fullWidth && { width: '100%' }]}>
      <Pressable
        style={(state) => {
          const userStyle = typeof style === 'function' ? style(state) : style;
          return [
            getButtonStyle(),
            state.pressed && variant !== 'primary' && { opacity: 0.7 },
            userStyle,
          ];
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        android_ripple={{ color: rippleColor, borderless: false }}
        {...rest}
      >
        {variant === 'primary' && (
          <LinearGradient
            colors={Gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}
        <ButtonContent />
      </Pressable>
    </Animated.View>
  );
}