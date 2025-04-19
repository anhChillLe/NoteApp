import { FC, Ref } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native'
import { MD3Colors, useTheme } from '../../../styles/ThemeProvider'
import Icon, { IconName } from '../Icon'

type IconButtonMode = 'standard' | 'outlined' | 'contained' | 'contained-tonal'
type IconButtonSize = 'small' | 'medium' | 'large' | 'xlarge'
interface IconButtonProps extends TouchableOpacityProps {
  ref?: Ref<View>
  icon: IconName
  mode?: IconButtonMode
  size?: IconButtonSize
  iconColor?: string
}

const IconButton: FC<IconButtonProps> = ({
  ref,
  icon,
  mode = 'standard',
  size = 'medium',
  style,
  ...props
}) => {
  const { colors } = useTheme()
  return (
    <TouchableOpacity
      ref={ref}
      style={[
        {
          height: getButtonSize(size),
          backgroundColor: getContainerColor(mode, colors),
        },
        styles.container,
        style,
      ]}
      {...props}
    >
      <Icon
        name={icon}
        size={getIconSize(size)}
        color={getIconColor(mode, colors)}
      />
    </TouchableOpacity>
  )
}

const getContainerColor = (mode: IconButtonMode, colors: MD3Colors) => {
  switch (mode) {
    case 'standard':
      return 'transparent'
    case 'outlined':
      return 'transparent'
    case 'contained':
      return colors.primary
    case 'contained-tonal':
      return colors.primaryContainer
  }
}

const getIconColor = (mode: IconButtonMode, colors: MD3Colors) => {
  switch (mode) {
    case 'standard':
      return colors.onSurface
    case 'outlined':
      return colors.onSurface
    case 'contained':
      return colors.onPrimary
    case 'contained-tonal':
      return colors.onPrimaryContainer
  }
}

const getButtonSize = (size: IconButtonSize) => {
  switch (size) {
    case 'small':
      return 36
    case 'medium':
      return 44
    case 'large':
      return 52
    case 'xlarge':
      return 60
  }
}

const getIconSize = (size: IconButtonSize) => {
  switch (size) {
    case 'small':
      return 20
    case 'medium':
      return 24
    case 'large':
      return 28
    case 'xlarge':
      return 32
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
  },
})

export default IconButton
export type { IconButtonProps }
