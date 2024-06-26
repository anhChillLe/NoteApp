import { FC, forwardRef } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import Animated, {
  AnimatedProps,
  useAnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { AnimatedPaper, AnimatedTouchableScale } from '~/components/Animated'
import { Fade, TouchableScaleProps } from '~/components/atoms'
import useMemoThemeStyle from '~/hooks/theme'
import { Note, Tag, TaskItem } from '~/services/database/model'
import { timeAgo } from '~/utils'

type Props = AnimatedProps<TouchableScaleProps> & {
  data: Note
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
  maxLineOfTitle?: number
  maxLineOfContent?: number
  isSelected?: boolean
  selectable?: boolean
  onTaskItemPress?: (item: TaskItem) => void
}

const NoteListItem = forwardRef<View, Props>(
  (
    {
      data,
      contentContainerStyle,
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

    const containerStyle = useAnimatedStyle(() => {
      return {
        borderRadius: roundness * 3,
        backgroundColor: colors.elevation.level1,
      }
    }, [colors, roundness])

    const { title, content } = data
    const hasTag = data.tags.length !== 0
    const hasTask = data.type == 'task'
    const hasTitle = !!data.title
    const hasContent = data.type == 'note'

    return (
      <AnimatedTouchableScale
        ref={ref}
        style={style}
        scaleValue={0.96}
        {...props}
      >
        <Animated.View
          style={[styles.container, containerStyle, contentContainerStyle]}
          pointerEvents={selectable ? 'none' : 'auto'}
        >
          <Fade isActive={isSelected} color={colors.elevation.level5} />
          {hasTitle && (
            <AnimatedPaper.Text
              variant="titleMedium"
              numberOfLines={maxLineOfTitle}
              children={title.trim()}
            />
          )}
          <Animated.View style={styles.date_row}>
            <AnimatedPaper.Divider style={styles.divider} />
            <AnimatedPaper.Text
              variant="labelSmall"
              style={styles.date_label}
              children={timeAgo(data.updateAt)}
            />

            {data.isPinned && (
              <AnimatedPaper.Icon
                source="thumbtack"
                size={10}
                color={colors.primary}
              />
            )}
          </Animated.View>
          {hasContent && (
            <Text
              variant="bodySmall"
              numberOfLines={maxLineOfContent}
              style={styles.content}
            >
              {content.trim()}
            </Text>
          )}
          {hasTask && (
            <View
              style={styles.task_list}
              pointerEvents={selectable ? 'none' : 'auto'}
            >
              {data.taskList.slice(0, maxLineOfContent).map((item, index) => (
                <TaskListItem
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
                <TagItem key={tag.id} data={tag} />
              ))}
            </View>
          )}
        </Animated.View>
      </AnimatedTouchableScale>
    )
  },
)

const TagItem: FC<{ data: Tag }> = ({ data }) => {
  const containerStyle = useMemoThemeStyle(({ colors, roundness }) => {
    return {
      borderRadius: roundness * 2,
      backgroundColor: colors.background,
      borderWidth: 0.4,
      borderColor: colors.outline,
    }
  })

  const labelStyle = useMemoThemeStyle(({ colors }) => {
    return {
      color: colors.onBackground,
    }
  })

  return (
    <View style={[styles.tag_container, containerStyle]}>
      <Text variant="labelSmall" style={labelStyle}>
        {data.name}
      </Text>
    </View>
  )
}

type TaskItemProps = AnimatedProps<TouchableScaleProps> & {
  data: TaskItem
}

const TaskListItem: FC<TaskItemProps> = ({ data, style, ...props }) => {
  const { colors } = useTheme()
  const { label, isChecked } = data

  const iconProps = useAnimatedProps(() => {
    return {
      color: isChecked ? colors.primary : colors.onBackground,
    }
  }, [colors, isChecked])

  return (
    <AnimatedTouchableScale
      style={[styles.task_item_container, style]}
      scaleValue={0.96}
      disabled={true}
      {...props}
    >
      <AnimatedPaper.Icon
        source={isChecked ? 'checkbox' : 'square'}
        size={16}
        animatedProps={iconProps}
      />
      <Text
        variant="labelMedium"
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[
          styles.task_item_label,
          {
            textDecorationLine: isChecked ? 'line-through' : 'none',
          },
        ]}
      >
        {label}
      </Text>
    </AnimatedTouchableScale>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'stretch',
    padding: 12,
    gap: 6,
    flex: 1,
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
    flex: 1,
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
  content: {
    flex: 1,
  },
  task_item_container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  task_item_label: {
    flex: 1,
  },
  tag_container: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
})

export default NoteListItem
