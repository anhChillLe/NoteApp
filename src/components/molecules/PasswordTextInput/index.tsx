import { forwardRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'
import { TextInput, TextInputProps, useTheme } from 'react-native-paper'

interface Props extends TextInputProps {}

const TextInputIcon = TextInput.Icon
TextInputIcon.defaultProps = undefined

const PasswordTextInput = forwardRef<RNTextInput, Props>((props, ref) => {
  const { roundness } = useTheme()
  const [isShowPassword, setIsShowPassword] = useState(false)

  return (
    <TextInput
      mode="outlined"
      outlineStyle={{ borderRadius: roundness * 3 }}
      secureTextEntry={!isShowPassword}
      right={
        <TextInputIcon
          icon={isShowPassword ? 'eye-crossed' : 'eye'}
          onPress={() => setIsShowPassword(it => !it)}
        />
      }
      inputMode="numeric"
      keyboardType="numeric"
      {...props}
    />
  )
})

export default PasswordTextInput
