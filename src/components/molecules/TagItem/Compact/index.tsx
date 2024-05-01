import { FC } from 'react'
import { StyleSheet, ViewProps } from 'react-native'
import { useTheme } from 'react-native-paper'
import Animated, {
  AnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { AnimatedPaper } from '~/components/atoms'

interface Props extends AnimatedProps<ViewProps> {
  label: string
}

export const TagItemCompact: FC<Props> = ({ label, style, ...props }) => {
  const { roundness, colors } = useTheme()

  const containerStyle = useAnimatedStyle(() => {
    return {
      borderRadius: roundness * 2,
      backgroundColor: colors.surfaceVariant,
    }
  }, [colors, roundness])

  const labelStyle = useAnimatedStyle(() => {
    return {
      color: colors.onSurfaceVariant,
    }
  }, [colors])

  return (
    <Animated.View style={[styles.container, containerStyle, style]} {...props}>
      <AnimatedPaper.Text variant="labelSmall" style={[labelStyle]}>
        {label}
      </AnimatedPaper.Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  label: {
    fontSize: 10,
  },
})
