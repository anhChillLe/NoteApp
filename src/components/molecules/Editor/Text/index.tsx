import { forwardRef } from 'react'
import { StyleSheet, TextInput, TextInputProps } from 'react-native'
import { useTheme } from 'react-native-paper'

interface Props extends TextInputProps {}

export const TextEditor = forwardRef<TextInput, Props>(
  ({ style, ...props }, ref) => {
    const { colors, fonts } = useTheme()
    const editorStyle = StyleSheet.flatten([
      styles.container,
      { color: colors.onBackground, fontFamily: fonts.default.fontFamily },
      style,
    ])

    return (
      <TextInput
        ref={ref}
        style={editorStyle}
        selectionColor={colors.primary}
        {...props}
      />
    )
  },
)

const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
  },
})
