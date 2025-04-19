import { TriggerNotification } from '@notifee/react-native'
import { Note, Tag, TaskItem } from 'note-app-database'
import { FC, Ref } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import {
  Divider,
  Icon,
  Text,
  TouchableScale,
  TouchableScaleProps,
  useTheme,
} from 'react-native-chill-ui'
import { AnimatedProps } from 'react-native-reanimated'
import { AnimatedTouchableScale } from '../Animated'

type Props = TouchableScaleProps & {
  ref?: Ref<View>
  data: Note
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
  maxLineOfTitle?: number
  maxLineOfContent?: number
  maxLineOfTaskList?: number
  isSelected?: boolean
  selectable?: boolean
  notification?: TriggerNotification
  onTaskItemPress?: (item: TaskItem) => void
}

const NoteListItem: FC<Props> = ({
  ref,
  data,
  contentContainerStyle,
  maxLineOfTitle = 1,
  maxLineOfContent = 6,
  maxLineOfTaskList = 4,
  isSelected = false,
  selectable = false,
  style,
  onTaskItemPress,
  notification,
  ...props
}) => {
  const { t } = useTranslation()
  const { roundness, colors } = useTheme()

  const { title, content, isPinned, isPrivate } = data
  const hasTag = data.tags.length > 0
  const hasTask = data.type === 'task'
  const hasTitle = !!data.title
  const hasContent = data.type === 'note'

  return (
    <TouchableScale ref={ref} scaleValue={0.96} style={[style]} {...props}>
      <View
        style={[
          styles.container,
          {
            borderRadius: roundness * 3,
            backgroundColor: isSelected
              ? colors.surfaceContainerHigh
              : colors.surfaceContainerLow,
          },
          contentContainerStyle,
        ]}
        pointerEvents={selectable ? 'none' : 'auto'}
      >
        {hasTitle && (
          <Text
            variant="titleMedium"
            numberOfLines={maxLineOfTitle}
            style={styles.title}
            children={title.trim()}
          />
        )}
        <View style={styles.date_row}>
          <Divider style={styles.divider} />
          <Text
            variant="labelSmall"
            style={styles.date_label}
            children={t('relative_time', {
              value: data.updateAt,
            })}
          />
          {isPinned && (
            <Icon name="bookmark-outline" size={10} color={colors.primary} />
          )}

          {!!notification && (
            <Icon
              name="notifications-outline"
              size={10}
              color={colors.primary}
            />
          )}

          {isPrivate && (
            <Icon name="lock-closed-outline" size={10} color={colors.primary} />
          )}
        </View>
        {hasContent && (
          <Text
            variant="bodySmall"
            numberOfLines={maxLineOfContent}
            style={styles.content}
            children={content.trim()}
          />
        )}
        {hasTask && (
          <View
            style={styles.task_list}
            pointerEvents={selectable ? 'none' : 'auto'}
          >
            {data.taskList.slice(0, maxLineOfTaskList).map((item, index) => (
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
      </View>
    </TouchableScale>
  )
}

const TagItem: FC<{ data: Tag }> = ({ data }) => {
  const { colors, roundness } = useTheme()
  const containerStyle = {
    borderRadius: roundness * 2,
    backgroundColor: colors.background,
    borderWidth: 0.4,
    borderColor: colors.outline,
  }

  const labelStyle = {
    color: colors.onBackground,
  }

  return (
    <View style={[styles.tag_container, containerStyle]}>
      <Text variant="labelSmall" style={labelStyle} children={data.name} />
    </View>
  )
}

type TaskItemProps = AnimatedProps<TouchableScaleProps> & {
  data: TaskItem
}

const TaskListItem: FC<TaskItemProps> = ({ data, style, ...props }) => {
  const { colors } = useTheme()
  const { label, isChecked } = data

  return (
    <AnimatedTouchableScale
      style={[styles.task_item_container, style]}
      scaleValue={0.96}
      disabled={true}
      {...props}
    >
      <Icon
        name={isChecked ? 'checkbox-outline' : 'square-outline'}
        size={16}
        color={isChecked ? colors.primary : colors.onBackground}
      />
      <Text
        variant="labelMedium"
        numberOfLines={1}
        ellipsizeMode="tail"
        style={styles.task_item_label}
        children={label}
      />
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
  title: {
    fontWeight: '600',
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
