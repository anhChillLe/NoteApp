import { FC, ReactElement } from 'react'
import { PaperProvider } from 'react-native-paper'
import {
  IconProps
} from 'react-native-paper/lib/typescript/components/MaterialCommunityIcon'
import { Settings } from 'react-native-paper/lib/typescript/core/settings'
import { FlatIcons } from '~/assets/icons/FlatIcons'

interface Props {
  children: ReactElement
}

const AppThemeProvider: FC<Props> = ({ children }) => {
  return <PaperProvider settings={settings}>{children}</PaperProvider>
}

const flatIcon = ({
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

const settings: Settings = {
  icon: flatIcon,
  rippleEffectEnabled: true
}

export default AppThemeProvider
