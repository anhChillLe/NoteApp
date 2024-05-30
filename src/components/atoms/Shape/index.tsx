import { FC, forwardRef, useMemo } from 'react'
import { View, ViewProps, ViewStyle } from 'react-native'
import { useTheme } from 'react-native-paper'

interface ShapeProps extends ViewProps {}

const Shape: FC<ShapeProps> = forwardRef<View, ShapeProps>(
  ({ style, ...props }, ref) => {
    const { colors, roundness } = useTheme()
    const themeStyle = useMemo<ViewStyle>(() => {
      return {
        borderRadius: roundness * 3,
        backgroundColor: colors.background,
      }
    }, [roundness, colors])

    return <View ref={ref} style={[themeStyle, style]} {...props} />
  },
)

export default Shape
