import { forwardRef } from 'react'
import { TextInput, TextInputProps } from 'react-native'
import { useTheme } from 'react-native-paper'

const Input = forwardRef<TextInput, TextInputProps>(
  ({ style, ...props }, ref) => {
    const { colors, fonts } = useTheme()

    return (
      <TextInput
        ref={ref}
        style={[
          {
            color: colors.onSurfaceVariant,
            fontFamily: fonts.default.fontFamily,
          },
          style,
        ]}
        selectionColor={colors.primary}
        {...props}
      />
    )
  },
)

export { Input }
