import { createIconSetFromIcoMoon } from 'react-native-vector-icons'
import icoMoonConfig from './selection.json'
import { Platform } from 'react-native'

export const FlatIcons = createIconSetFromIcoMoon(
  icoMoonConfig,
  Platform.select({ ios: 'icomoon', android: 'FlatIcons' }),
  'FlatIcons.ttf',
)
