import { FC, Ref } from 'react'
import { StyleProp, Text, TextStyle } from 'react-native'
import { MD3Colors, useTheme } from '../../../styles/ThemeProvider'
import Icon, { IconName } from '../Icon'
import { useButton } from './ButtonContext'
import { ButtonMode, ButtonSize } from './ButtonType'

interface ButtonIconProps {
  ref?: Ref<Text>
  name: IconName
  size?: number
  color?: string
  style?: StyleProp<TextStyle>
}

const ButtonIcon: FC<ButtonIconProps> = ({ ref, name, size, color, style }) => {
  const theme = useTheme()
  const button = useButton()
  return (
    <Icon
      ref={ref}
      name={name}
      size={size ?? getIconSize(button.size)}
      color={color ?? getIconColor(button.mode, theme.colors)}
      style={style}
    />
  )
}

const getIconColor = (mode: ButtonMode, colors: MD3Colors) => {
  switch (mode) {
    case 'text':
      return colors.primary
    case 'outlined':
      return colors.primary
    case 'contained':
      return colors.onPrimary
    case 'contained-tonal':
      return colors.onPrimaryContainer
  }
}

const getIconSize = (mode: ButtonSize) => {
  switch (mode) {
    case 'small':
      return 14
    case 'medium':
      return 16
    case 'large':
      return 18
    case 'xlarge':
      return 20
  }
}

export type { ButtonIconProps }
export default ButtonIcon
