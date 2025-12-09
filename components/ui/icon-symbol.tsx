// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Home icons
  'house.fill': 'home',
  'house': 'home',

  // Plus/Add icons
  'plus.circle.fill': 'add-circle',
  'plus.circle': 'add-circle-outline',

  // Heart/Favorites icons
  'heart.fill': 'favorite',
  'heart': 'favorite-border',

  // Person/Profile icons
  'person.fill': 'person',
  'person': 'person-outline',
  'person.2.fill': 'group',

  // Action icons
  'trash': 'delete',
  'pencil': 'edit',
  'xmark.circle.fill': 'cancel',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',

  // Contact/Info icons
  'phone.fill': 'phone',
  'location.fill': 'location-on',
  'star.fill': 'star',

  // Amenities icons
  'video.fill': 'videocam',
  'car.fill': 'directions-car',
  'wifi': 'wifi',
  'snowflake': 'ac-unit',
  'bed.double.fill': 'bed',
  'refrigerator.fill': 'kitchen',

  // Management/List icons
  'list.bullet': 'list',

  // Support/Info icons
  'questionmark.circle.fill': 'help',
  'doc.text.fill': 'description',
  'lock.fill': 'lock',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
