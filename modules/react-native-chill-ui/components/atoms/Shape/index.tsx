import { FC, Ref, useMemo } from 'react'
import { View, ViewProps, ViewStyle } from 'react-native'
import { useTheme } from '../../../styles/ThemeProvider'

interface ShapeProps extends ViewProps {
  ref?: Ref<View>
  roundnessLevel?: 1 | 2 | 3 | 4 | 5 | 6
}

const Shape: FC<ShapeProps> = ({
  ref,
  style,
  roundnessLevel = 3,
  ...props
}) => {
  const { colors, roundness } = useTheme()
  const themeStyle = useMemo<ViewStyle>(() => {
    return {
      borderRadius: roundness * roundnessLevel,
      backgroundColor: colors.background,
    }
  }, [roundness, colors, roundnessLevel])

  return <View ref={ref} style={[themeStyle, style]} {...props} />
}

export default Shape
export type { ShapeProps }
