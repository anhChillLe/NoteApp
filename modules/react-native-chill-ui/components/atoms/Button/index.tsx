import { FC, Ref } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native'
import { MD3Colors, useTheme } from '../../../styles/ThemeProvider'
import { IconName } from '../Icon'
import ButtonContext from './ButtonContext'
import ButtonIcon from './ButtonIcon'
import ButtonText from './ButtonText'
import { ButtonMode, ButtonSize } from './ButtonType'

interface ButtonBaseProps extends Omit<TouchableOpacityProps, 'children'> {
  ref?: Ref<View>
  mode?: ButtonMode
  size?: ButtonSize
  loading?: boolean
}

interface ButtonWithTitleIconProps extends ButtonBaseProps {
  title?: string
  icon?: IconName
  children?: undefined
}

interface ButtonWithChildrenProps extends ButtonBaseProps {
  title?: undefined
  icon?: undefined
  children: React.ReactNode
}

type ButtonProps = ButtonWithTitleIconProps | ButtonWithChildrenProps

type ButtonComponent = FC<ButtonProps>

type Button = ButtonComponent & {
  Icon: typeof ButtonIcon
  Text: typeof ButtonText
}

const Button: Button = ({
  ref,
  mode = 'text',
  size = 'medium',
  title,
  icon,
  style,
  children,
  disabled,
  loading,
  ...props
}) => {
  const { colors } = useTheme()

  return (
    <ButtonContext.Provider value={{ mode, size }}>
      <TouchableOpacity
        ref={ref}
        style={[
          {
            backgroundColor: getButtonColor(mode, colors),
            borderColor: getButtonOutlineColor(mode, colors),
            height: getButtonSize(size),
            borderRadius: getButtonBorderRadius(size),
          },
          disabled && styles.disabled,
          styles.container,
          style,
        ]}
        disabled={disabled || loading}
        {...props}
      >
        {children ? (
          children
        ) : (
          <>
            {icon && <ButtonIcon name={icon} />}
            {title && <ButtonText children={title} />}
          </>
        )}
      </TouchableOpacity>
    </ButtonContext.Provider>
  )
}

const getButtonSize = (size: ButtonSize) => {
  switch (size) {
    case 'small':
      return 48
    case 'medium':
      return 52
    case 'large':
      return 56
    case 'xlarge':
      return 60
  }
}

const getButtonBorderRadius = (size: ButtonSize): number => {
  switch (size) {
    case 'small':
      return 24
    case 'medium':
      return 26
    case 'large':
      return 28
    case 'xlarge':
      return 30
  }
}

const getButtonColor = (mode: ButtonMode, colors: MD3Colors): string => {
  switch (mode) {
    case 'text':
    case 'outlined':
      return 'transparent'
    case 'contained':
      return colors.primary
    case 'contained-tonal':
      return colors.primaryContainer
  }
}

const getButtonOutlineColor = (mode: ButtonMode, colors: MD3Colors): string => {
  switch (mode) {
    case 'text':
      return 'transparent'
    case 'outlined':
      return colors.outline
    case 'contained':
      return colors.primary
    case 'contained-tonal':
      return colors.primaryContainer
  }
}

Button.Icon = ButtonIcon
Button.Text = ButtonText

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 8,
    borderWidth: 1,
  },
  disabled: {
    opacity: 0.5,
  },
})

export type { ButtonProps }
export default Button
