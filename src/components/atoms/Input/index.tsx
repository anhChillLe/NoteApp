import { forwardRef } from 'react'
import { TextInput, TextInputProps } from 'react-native'
import { useTheme } from 'react-native-paper'

const Input = forwardRef<TextInput, TextInputProps>(
  ({ style, ...props }, ref) => {
    const { colors, fonts, dark } = useTheme()

    return (
      <TextInput
        ref={ref}
        style={[
          {
            opacity: !!props.value ? 1 : 0.6,
            color: colors.onSurfaceVariant,
            fontFamily: fonts.default.fontFamily,
          },
          style,
        ]}
        keyboardAppearance={dark ? 'dark' : 'default'}
        placeholderTextColor={colors.onSurfaceDisabled}
        selectionColor={colors.primaryContainer}
        cursorColor={colors.primary}
        selectionHandleColor={colors.primary}
        {...props}
      />
    )
  },
)

export default Input
