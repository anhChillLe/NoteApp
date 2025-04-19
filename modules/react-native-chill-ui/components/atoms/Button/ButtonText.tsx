import { FC, Ref } from 'react'
import { Text as NativeText, Text, TextProps } from 'react-native'
import { MD3Colors, useTheme } from '../../../styles/ThemeProvider'
import { useButton } from './ButtonContext'
import { ButtonMode, ButtonSize } from './ButtonType'

interface ButtonTextProps extends TextProps {
  ref?: Ref<NativeText>
}

const ButtonText: FC<ButtonTextProps> = ({ ref, style, ...props }) => {
  const theme = useTheme()
  const button = useButton()
  return (
    <Text
      ref={ref}
      style={[
        {
          color: getTextColor(button.mode, theme.colors),
          fontSize: getTextSize(button.size),
        },
        style,
      ]}
      {...props}
    />
  )
}

const getTextColor = (mode: ButtonMode, colors: MD3Colors) => {
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

const getTextSize = (mode: ButtonSize) => {
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

export type { ButtonTextProps }
export default ButtonText
