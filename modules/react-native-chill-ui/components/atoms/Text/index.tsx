import { FC, Ref } from 'react'
import { Text as NativeText, TextProps as NativeTextProps } from 'react-native'
import { MD3TypescaleKey, useTheme } from '../../../styles/ThemeProvider'

export interface TextProps extends NativeTextProps {
  ref?: Ref<NativeText>
  variant?: keyof typeof MD3TypescaleKey
}

const Text: FC<TextProps> = ({
  ref,
  style,
  variant = 'bodyMedium',
  ...rest
}) => {
  const theme = useTheme()
  return (
    <NativeText
      ref={ref}
      style={[
        style,
        theme.fonts[variant],
        { color: theme.colors.onSurface },
        style,
      ]}
      {...rest}
    />
  )
}

export default Text
