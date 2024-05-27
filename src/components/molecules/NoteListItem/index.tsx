import { forwardRef, useEffect, useMemo } from 'react'
import {
  PressableProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { Text, useTheme } from 'react-native-paper'
import Animated, {
  AnimatedProps,
  LinearTransition,
  measure,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { AnimatedPaper, AnimatedPressable } from '~/components/Animated'
import { Note, TaskItem } from '~/services/database/model'
import { TagItemCompact } from '../TagItem/Compact'
import { Item } from './TaskItem'

type Props = AnimatedProps<PressableProps> & {
  data: Note
  emptyContent?: string
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
  maxLineOfTitle?: number
  maxLineOfContent?: number
  isSelected?: boolean
  selectable?: boolean
  onTaskItemPress?: (item: TaskItem) => void
}

export const NoteListItem = forwardRef<View, Props>(
  (
    {
      data,
      contentContainerStyle,
      emptyContent = 'Empty text',
      maxLineOfTitle = 1,
      maxLineOfContent = 6,
      isSelected = false,
      selectable = false,
      style,
      onTaskItemPress,
      ...props
    },
    ref,
  ) => {
    const { roundness, colors } = useTheme()
    const { title, content } = getContentTitle(data, emptyContent)
    const progress = useSharedValue(0)
    const scale = useSharedValue(1)
    const rippleRef = useAnimatedRef<View>()

    const rippleScale = useSharedValue(0)

    const rippleOpacity = useSharedValue(1)

    const { activeX, activeY, gesture, isPressed } = useGesture()

    const containerStyle = useAnimatedStyle(() => {
      return {
        borderRadius: roundness * 3,
        backgroundColor: colors.elevation.level1,
        transform: [{ scale: scale.value }],
      }
    }, [colors, roundness])

    const rippleStyle = useAnimatedStyle(() => {
      const m = measure(rippleRef)
      const w = m?.width ?? 0
      const h = m?.height ?? 0
      const size = Math.sqrt(w ** 2 + h ** 2) // c^2 = a^2 + b^2

      return {
        borderRadius: size,
        top: activeY.value - size,
        left: activeX.value - size,
        width: 2 * size,
        height: 2 * size,
        opacity: rippleOpacity.value,
        transform: [{ scale: rippleScale.value }],
        backgroundColor: colors.elevation.level3,
      }
    }, [colors])

    useEffect(() => {
      if (isSelected) {
        rippleOpacity.value = 1
        rippleScale.value = withTiming(1, { duration: 250 })
      } else {
        rippleOpacity.value = withTiming(0, { duration: 150 }, () => {
          rippleScale.value = 0
        })
      }
    }, [isSelected])

    useAnimatedReaction(
      () => isPressed.value,
      () => {
        scale.value = withTiming(isPressed.value ? 0.95 : 1, { duration: 100 })
      },
      [],
    )

    useEffect(() => {
      progress.value = withTiming(isSelected ? 1 : 0, { duration: 100 })
    }, [isSelected])

    const hasTag = data.tags.length !== 0
    const hasTask = data.type == 'task'
    const hasContent = data.type == 'note' || data.taskList.length === 0

    return (
      <GestureDetector gesture={gesture}>
        <AnimatedPressable ref={ref} style={[containerStyle, style]} {...props}>
          <Animated.View style={[styles.container, contentContainerStyle]}>
            <View
              ref={rippleRef}
              style={[styles.ripple_container, { borderRadius: roundness * 3 }]}
            >
              <Animated.View style={[styles.ripple, rippleStyle]} />
            </View>
            <AnimatedPaper.Text
              variant="titleMedium"
              numberOfLines={maxLineOfTitle}
            >
              {title.trim()}
            </AnimatedPaper.Text>
            <Animated.View style={styles.date_row} layout={LinearTransition}>
              <AnimatedPaper.Divider
                style={styles.divider}
                layout={LinearTransition}
              />
              <AnimatedPaper.Text
                variant="labelSmall"
                style={styles.date_label}
                layout={LinearTransition}
              >
                {data.updateAt.toDateString()}
              </AnimatedPaper.Text>
              {data.isPinned && (
                <AnimatedPaper.Icon
                  layout={LinearTransition}
                  source="thumbtack"
                  size={10}
                  color={colors.primary}
                />
              )}
            </Animated.View>
            {hasContent && (
              <Text variant="bodySmall" numberOfLines={maxLineOfContent}>
                {content.trim()}
              </Text>
            )}
            {hasTask && (
              <View
                style={styles.task_list}
                pointerEvents={selectable ? 'none' : 'auto'}
              >
                {data.taskList.slice(0, maxLineOfContent).map((item, index) => (
                  <Item
                    key={index}
                    data={item}
                    disabled={selectable || !onTaskItemPress}
                    onPress={() => onTaskItemPress?.(item)}
                  />
                ))}
              </View>
            )}
            {hasTag && (
              <View style={styles.tag_group}>
                {data.tags.map(tag => (
                  <TagItemCompact key={tag.id} label={tag.name} />
                ))}
              </View>
            )}
          </Animated.View>
        </AnimatedPressable>
      </GestureDetector>
    )
  },
)

const getContentTitle = (data: Note, emptyContent: string) => {
  if (data.title && data.content) return data
  else if (data.title) return { title: data.title, content: emptyContent }
  else {
    const contents = data.content.split('\n')
    const [title, ...resContent] = contents
    const content =
      resContent.length !== 0 ? resContent.join('\n') : emptyContent
    return { title, content }
  }
}

const useGesture = () => {
  const isPressed = useSharedValue(false)
  const activeX = useSharedValue(0)
  const activeY = useSharedValue(0)

  const gesture = useMemo(() => {
    return Gesture.Tap()
      .onBegin(e => {
        isPressed.value = true
        activeX.value = e.x
        activeY.value = e.y
      })
      .onFinalize(() => {
        isPressed.value = false
      })
  }, [])

  return {
    gesture,
    activeX,
    activeY,
    isPressed,
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    padding: 12,
    gap: 6,
  },
  divider: {
    flex: 1,
  },
  tag_group: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  date_row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  task_list: {
    alignItems: 'stretch',
  },
  date_label: {
    opacity: 0.5,
  },
  ripple_container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  ripple: {
    position: 'absolute',
  },
})
