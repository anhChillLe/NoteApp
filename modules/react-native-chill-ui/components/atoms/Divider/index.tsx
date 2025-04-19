import { FC, Ref } from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'
import { useTheme } from '../../../styles/ThemeProvider'

interface DividerProps extends ViewProps {
  ref?: Ref<View>
}

const Divider: FC<DividerProps> = ({ ref, style, ...props }) => {
  const { colors } = useTheme()
  return (
    <View
      ref={ref}
      style={[
        styles.container,
        { backgroundColor: colors.outlineVariant },
        style,
      ]}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    height: StyleSheet.hairlineWidth,
  },
})

export default Divider
export type { DividerProps }
