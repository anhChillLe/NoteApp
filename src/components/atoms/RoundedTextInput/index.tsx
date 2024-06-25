import { forwardRef } from 'react'
import { TextInput as RNTextInput } from 'react-native'
import { TextInput, TextInputProps, useTheme } from 'react-native-paper'

interface Props extends TextInputProps {}

const RoundedTextInput = forwardRef<RNTextInput, Props>(
  ({ outlineStyle, ...props }, ref) => {
    const { roundness } = useTheme()
    return (
      <TextInput
        ref={ref}
        outlineStyle={[{ borderRadius: roundness * 3 }, outlineStyle]}
        {...props}
      />
    )
  },
)

export default RoundedTextInput
