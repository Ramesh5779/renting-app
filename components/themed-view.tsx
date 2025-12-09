import { Gradients } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { LinearGradient } from 'expo-linear-gradient';
import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'elevated' | 'secondary' | 'gradient';
  gradientColors?: readonly [string, string, ...string[]];
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  type = 'default',
  gradientColors,
  ...otherProps
}: ThemedViewProps) {
  const bgDefault = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const bgElevated = useThemeColor({}, 'backgroundElevated');
  const bgSecondary = useThemeColor({}, 'backgroundSecondary');

  let backgroundColor = bgDefault;
  if (!lightColor && !darkColor) {
    switch (type) {
      case 'elevated':
        backgroundColor = bgElevated;
        break;
      case 'secondary':
        backgroundColor = bgSecondary;
        break;
      case 'gradient':
        backgroundColor = 'transparent';
        break;
    }
  }

  if (type === 'gradient' || gradientColors) {
    const colors = gradientColors || Gradients.background;
    return (
      <LinearGradient
        colors={colors}
        style={[{ backgroundColor }, style]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        {...otherProps}
      />
    );
  }

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
