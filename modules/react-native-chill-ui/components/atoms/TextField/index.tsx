import { FC, ReactElement, Ref, useCallback, useState } from 'react'
import {
  NativeSyntheticEvent,
  TextInput as NativeTextInput,
  TextInputProps as NativeTextInputProps,
  StyleSheet,
  TextInputFocusEventData,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native'
import { MD3Colors, useTheme } from '../../../styles/ThemeProvider'
import Icon, { IconName } from '../Icon'
import Input from '../TextInput'

type TextFieldMode = 'outlined' | 'filled'
interface TextFieldProps extends NativeTextInputProps {
  ref?: Ref<NativeTextInput>
  mode?: TextFieldMode
  right?: ReactElement
  left?: ReactElement
  error?: boolean
}

type TextFieldType = FC<TextFieldProps> & {
  Icon: FC<TextFieldIconProps>
}

const TextField: TextFieldType = ({
  ref,
  mode = 'outlined',
  style,
  onFocus,
  onBlur,
  left,
  right,
  ...props
}) => {
  const [focused, setFocused] = useState(false)
  const { colors } = useTheme()

  const handleFocus = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(true)
      onFocus?.(e)
    },
    [setFocused, onFocus],
  )

  const handleBlur = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(false)
      onBlur?.(e)
    },
    [setFocused, onBlur],
  )

  return (
    <View
      style={[
        { backgroundColor: getBackgroundColor(mode, colors) },
        mode === 'outlined' && getOutlinedStyle(focused, colors),
        styles.container,
        style,
      ]}
    >
      {left}
      <Input
        ref={ref}
        style={styles.input}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {right}
    </View>
  )
}

const getBackgroundColor = (mode: TextFieldMode, colors: MD3Colors) => {
  switch (mode) {
    case 'outlined':
      return colors.surface
    case 'filled':
      return colors.surfaceVariant
  }
}

const getOutlinedStyle = (focused: boolean, colors: MD3Colors): ViewStyle => {
  return {
    borderWidth: focused ? 2 : 1,
    borderColor: focused ? colors.primary : colors.onSurfaceVariant,
  }
}

interface TextFieldIconProps extends TouchableOpacityProps {
  ref?: Ref<View>
  icon: IconName
}

const TextFieldIcon: FC<TextFieldIconProps> = ({ ref, icon, ...props }) => {
  const { colors } = useTheme()
  return (
    <TouchableOpacity ref={ref} {...props}>
      <Icon name={icon} size={16} color={colors.onSurface} />
    </TouchableOpacity>
  )
}

TextField.Icon = TextFieldIcon

const styles = StyleSheet.create({
  container: {
    height: 56,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    borderRadius: 16,
  },
  input: {
    height: '100%',
  },
})

export default TextField
export type { TextFieldProps }
