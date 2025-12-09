import { BorderRadius, Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { TextInput, type TextInputProps, View } from 'react-native';
import { ThemedText } from '../themed-text';

export type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'outlined';
  size?: 'small' | 'medium' | 'large';
};

export function Input({
  label,
  error,
  helperText,
  variant = 'outlined',
  size = 'medium',
  style,
  ...rest
}: InputProps) {
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'backgroundElevated');
  const borderColor = useThemeColor({}, 'border');
  const errorColor = '#FF3B30'; // Red color for errors

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: Spacing.sm,
          paddingVertical: Spacing.xs,
          minHeight: 36,
          fontSize: Typography.bodySmall.fontSize,
        };
      case 'medium':
        return {
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.sm,
          minHeight: 48,
          fontSize: Typography.body.fontSize,
        };
      case 'large':
        return {
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.md,
          minHeight: 56,
          fontSize: Typography.bodyLarge.fontSize,
        };
    }
  };

  const getInputStyle = () => {
    const baseStyle = {
      borderRadius: BorderRadius.md,
      backgroundColor: backgroundColor,
      color: textColor,
      ...getSizeStyle(),
    };

    const variantStyles = {
      default: {
        borderWidth: 0,
      },
      outlined: {
        borderWidth: 1,
        borderColor: error ? errorColor : borderColor,
      },
    };

    return [baseStyle, variantStyles[variant]];
  };

  return (
    <View style={{ width: '100%' }}>
      {label && (
        <ThemedText
          type="label"
          variant="primary"
          style={{ marginBottom: Spacing.xs }}
        >
          {label}
        </ThemedText>
      )}

      <TextInput
        style={[getInputStyle(), style]}
        placeholderTextColor={useThemeColor({}, 'textTertiary')}
        selectionColor={useThemeColor({}, 'primary')}
        {...rest}
      />

      {(error || helperText) && (
        <ThemedText
          type="caption"
          variant="tertiary"
          style={{
            marginTop: Spacing.xs,
            color: error ? errorColor : undefined,
          }}
        >
          {error || helperText}
        </ThemedText>
      )}
    </View>
  );
}