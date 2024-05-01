import { forwardRef, useEffect } from 'react'
import {
  PressableProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import Animated, {
  AnimatedProps,
  LinearTransition,
  interpolateColor,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { AnimatedPaper } from '~/components/atoms'
import { AnimatedPressable } from '~/components/atoms/Animated'
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
      isSelected,
      selectable,
      style,
      onTaskItemPress,
      ...props
    },
    ref,
  ) => {
    const { roundness, colors } = useTheme()
    const { title, content } = getContentTitle(data, emptyContent)
    const progress = useSharedValue(0)
    const isPressed = useSharedValue(false)
    const scale = useSharedValue(1)

    const handlePressIn = () => (isPressed.value = true)
    const handlePressOut = () => (isPressed.value = false)

    useAnimatedReaction(
      () => isPressed.value,
      () => {
        scale.value = withTiming(isPressed.value ? 0.9 : 1, { duration: 200 })
      },
    )

    useEffect(() => {
      progress.value = withTiming(isSelected ? 1 : 0, { duration: 200 })
    }, [isSelected])

    const containerStyle = useAnimatedStyle(() => {
      const backgroundColor = !selectable
        ? colors.elevation.level1
        : interpolateColor(
            progress.value,
            [0, 1],
            [colors.elevation.level1, colors.elevation.level5],
          )
      return {
        borderRadius: roundness * 3,
        backgroundColor,
        transform: [{ scale: scale.value }],
      }
    }, [colors, roundness, selectable])

    const hasTag = data.tags.length !== 0
    const hasTask = data.type == 'task'
    const hasContent = data.type == 'note' || data.taskList.length === 0

    return (
      <AnimatedPressable
        ref={ref}
        style={[containerStyle, style]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...props}
      >
        <Animated.View style={[styles.container, contentContainerStyle]}>
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
            <View style={styles.task_list}>
              {data.taskList.slice(0, maxLineOfContent).map((item, index) => (
                <Item
                  key={index}
                  data={item}
                  disabled={selectable}
                  onPress={() => {
                    onTaskItemPress?.(item)
                  }}
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
})
