import { forwardRef } from 'react'
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
} from 'react-native'
import { useTheme } from 'react-native-paper'
import { styles } from '../style'
import { Style } from '~/services/database/model'

type TextMode = 'default' | 'bold' | 'italic' | 'strike-through'
type TextSize = 'h1' | 'h2' | 'h3' | 'content'
interface Props extends TextInputProps {
  mode?: TextMode
  size?: TextSize
}

const styleMap: Record<TextMode, TextStyle> = {
  default: {},
  bold: styles.bold,
  italic: styles.italic,
  'strike-through': styles['strike-through'],
}

const sizeMap: Record<TextSize, TextStyle> = {
  h1: styles.h1,
  h2: styles.h2,
  h3: styles.h3,
  content: styles.content,
}

export const TextEditor = forwardRef<TextInput, Props>(
  ({ mode = 'default', style, size = 'content', ...props }, ref) => {
    const { colors, fonts } = useTheme()
    const editorStyle = StyleSheet.flatten([
      { paddingVertical: 0 },
      { color: colors.onBackground, fontFamily: fonts.default.fontFamily },
      styleMap[mode],
      sizeMap[size],
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
