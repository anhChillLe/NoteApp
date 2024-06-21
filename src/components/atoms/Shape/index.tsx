import { FC, forwardRef, useMemo } from 'react'
import { View, ViewProps, ViewStyle } from 'react-native'
import { useTheme } from 'react-native-paper'

interface ShapeProps extends ViewProps {
  roundnessLevel?: 1 | 2 | 3 | 4 | 5 | 6
}

const Shape: FC<ShapeProps> = forwardRef<View, ShapeProps>(
  ({ style, roundnessLevel = 3, ...props }, ref) => {
    const { colors, roundness } = useTheme()
    const themeStyle = useMemo<ViewStyle>(() => {
      return {
        borderRadius: roundness * roundnessLevel,
        backgroundColor: colors.background,
      }
    }, [roundness, colors, roundnessLevel])

    return <View ref={ref} style={[themeStyle, style]} {...props} />
  },
)

export default Shape
