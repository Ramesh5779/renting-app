import { Text, type TextProps } from 'react-native';

import { Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'hero' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'subtitle' | 'bodyLarge' | 'body' | 'bodyMedium' | 'bodySmall' | 'button' | 'buttonSmall' | 'caption' | 'overline' | 'label' | 'price' | 'link';
  variant?: 'primary' | 'secondary' | 'tertiary';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'body',
  variant = 'primary',
  ...rest
}: ThemedTextProps) {
  const colorText = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const colorSecondary = useThemeColor({}, 'textSecondary');
  const colorTertiary = useThemeColor({}, 'textTertiary');

  let color = colorText;
  if (!lightColor && !darkColor) {
    if (variant === 'secondary') {
      color = colorSecondary;
    } else if (variant === 'tertiary') {
      color = colorTertiary;
    }
  }
  const linkColor = useThemeColor({}, 'primary');

  return (
    <Text
      style={[
        { color: type === 'link' ? linkColor : color },
        Typography[type],
        style,
      ]}
      {...rest}
    />
  );
};
