import { FC } from 'react'
import { PressableProps, StyleSheet } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import {
  AnimatedProps,
  LinearTransition,
  ZoomIn,
  ZoomOut,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { AnimatedPaper, AnimatedPressable } from '~/components/atoms/Animated'
import { Tag } from '~/services/database/model'

interface Props extends AnimatedProps<PressableProps> {
  data: Tag
  totalNote?: number
  totalTask?: number
  selectable?: boolean
  isSelected?: boolean
}

export const TagItemFull: FC<Props> = ({
  data,
  selectable,
  isSelected,
  totalNote = 0,
  totalTask = 0,
  style,
  ...props
}) => {
  const { colors, roundness } = useTheme()
  const containerStyle = useAnimatedStyle(() => {
    const defaultColor = colors.elevation.level1
    const selectedColor = colors.elevation.level5
    const backgroundColor = isSelected ? selectedColor : defaultColor
    return {
      backgroundColor,
      borderRadius: roundness * 2,
    }
  }, [colors, roundness, isSelected])

  return (
    <AnimatedPressable
      style={[styles.container, containerStyle, style]}
      {...props}
    >
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
      <AnimatedPaper.Text>{totalNote + totalTask}</AnimatedPaper.Text>
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  name: {
    flex: 1,
  },
})
