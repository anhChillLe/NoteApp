import { FC } from 'react'
import { GestureResponderEvent, PressableProps, StyleSheet } from 'react-native'
import { FAB, Text, TouchableRippleProps, useTheme } from 'react-native-paper'
import Animated, {
  AnimatedProps,
  LinearTransition,
  ZoomIn,
  ZoomOut,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { AnimatedPaper, AnimatedPressable } from '~/components/Animated'
import { Fade, Ripple } from '~/components/atoms'
import { Tag } from '~/services/database/model'

interface Props extends AnimatedProps<Omit<TouchableRippleProps, 'children'>> {
  data: Tag
  count?: number
  selectable?: boolean
  isSelected?: boolean
}

const TagListItem: FC<Props> = ({
  data,
  selectable,
  isSelected,
  count = 0,
  style,
  ...props
}) => {
  const { colors, roundness } = useTheme()

  return (
    <AnimatedPaper.TouchableRipple
      style={[
        {
          borderRadius: roundness * 3,
          backgroundColor: colors.elevation.level1,
        },
        style,
      ]}
      borderless
      {...props}
    >
      <Animated.View style={styles.container}>
        {selectable && (
          <Fade isActive={!!isSelected} color={colors.elevation.level3} />
        )}
        {selectable && (
          <AnimatedPaper.Icon
            source={isSelected ? 'checkbox' : 'square'}
            size={16}
            color={isSelected ? colors.primary : colors.onBackground}
            layout={LinearTransition}
          />
        )}

        <AnimatedPaper.Text
          variant="titleMedium"
          layout={LinearTransition}
          style={styles.name}
        >
          {data.name}
        </AnimatedPaper.Text>

        {data.isPinned && (
          <AnimatedPaper.Icon
            source="thumbtack"
            size={16}
            color={colors.primary}
            layout={LinearTransition}
            entering={ZoomIn.duration(100)}
            exiting={ZoomOut.duration(100)}
          />
        )}
        <Text>{count}</Text>
      </Animated.View>
    </AnimatedPaper.TouchableRipple>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  name: {
    flex: 1,
  },
})

export default TagListItem
