import { FC, Ref } from 'react'
import {
  TextInput as NativeTextInput,
  TextInputProps as NativeTextInputProps,
  StyleSheet,
} from 'react-native'
import { useTheme } from '../../../styles/ThemeProvider'

interface TextInputProps extends NativeTextInputProps {
  ref?: Ref<NativeTextInput>
}

const TextInput: FC<TextInputProps> = ({ ref, style, ...props }) => {
  const { colors, fonts } = useTheme()

  return (
    <NativeTextInput
      ref={ref}
      style={[
        { color: colors.onSurface },
        fonts.default,
        styles.container,
        style,
      ]}
      placeholderTextColor={colors.onSurfaceVariant}
      selectionColor={colors.primary}
      cursorColor={colors.primary}
      selectionHandleColor={colors.primary}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
  },
})

export default TextInput
export type { TextInputProps }
