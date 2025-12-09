import { BorderRadius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';
import { ThemedText } from '../themed-text';
import { IconSymbol } from './icon-symbol';

export type SearchBarProps = TextInputProps & {
  onFilterPress?: () => void;
  showFilter?: boolean;
  resultsCount?: number;
};

export function SearchBar({
  onFilterPress,
  showFilter = true,
  resultsCount,
  style,
  ...rest
}: SearchBarProps) {
  const backgroundColor = useThemeColor({}, 'backgroundElevated');
  const borderColor = useThemeColor({}, 'borderLight');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const placeholderColor = useThemeColor({}, 'textTertiary');

  return (
    <View style={style as any}>
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: backgroundColor,
            borderRadius: BorderRadius.input,
            borderWidth: 1,
            borderColor: borderColor,
            paddingHorizontal: Spacing.lg,
            paddingVertical: Spacing.md,
            ...Shadows.input,
          } as any,
        ]}
      >
        <IconSymbol
          name="magnifyingglass"
          size={20}
          color={iconColor}
          style={{ marginRight: Spacing.md }}
        />

        <TextInput
          style={[
            {
              flex: 1,
              color: textColor,
              ...Typography.body,
              padding: 0,
            } as any,
            { outline: 'none' } as any,
          ]}
          placeholderTextColor={placeholderColor}
          selectionColor={useThemeColor({}, 'primary')}
          {...rest}
        />

        {showFilter && (
          <Pressable
            onPress={onFilterPress}
            style={{
              marginLeft: Spacing.md,
              padding: Spacing.xs,
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconSymbol
              name="slider.horizontal.3"
              size={20}
              color={iconColor}
            />
          </Pressable>
        )}
      </View>

      {resultsCount !== undefined && (
        <ThemedText
          type="caption"
          variant="secondary"
          style={{
            marginTop: Spacing.sm,
            marginLeft: Spacing.xs,
          }}
        >
          {resultsCount} result{resultsCount !== 1 ? 's' : ''} found
        </ThemedText>
      )}
    </View>
  );
}