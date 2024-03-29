import { IconProps } from 'react-native-paper/lib/typescript/components/MaterialCommunityIcon'
import { FlatIcons } from '~/assets/icons/FlatIcons'

export const FlatIcon = ({
  name,
  color,
  size,
  direction,
  allowFontScaling,
  testID,
}: IconProps) => (
  <FlatIcons
    allowFontScaling={allowFontScaling}
    name={name}
    color={color}
    size={size}
    style={{
      transform: [{ scaleX: direction === 'rtl' ? -1 : 1 }],
      lineHeight: size,
      backgroundColor: 'transparent',
    }}
    selectable={false}
    testID={testID}
    accessibilityElementsHidden={true}
    importantForAccessibility="no-hide-descendants"
  />
)
