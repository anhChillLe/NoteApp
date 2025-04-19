import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import {
  Button,
  Checkbox,
  Chip,
  Divider,
  Icon,
  IconButton,
  Text,
  useTheme,
} from 'react-native-chill-ui'
import { FadeInDown } from 'react-native-reanimated'
import { AnimatedPressable, AnimatedShape } from '~/components'
import { useNoteView } from './Provider'

const NoteViewLayout: FC = () => {
  return (
    <View
      style={styles.container}
      accessibilityViewIsModal
      accessibilityLiveRegion="polite"
    >
      <Backdrop />
      <AnimatedShape
        style={styles.content}
        roundnessLevel={5}
        entering={FadeInDown}
      >
        <Header />
        <ScrollView
          contentContainerStyle={styles.note_content}
          bounces={false}
          overScrollMode="never"
        >
          <Title />
          <TimeLine />
          <TagList />
          <Content />
          <TaskList />
        </ScrollView>
      </AnimatedShape>
    </View>
  )
}

const Backdrop: FC = () => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { goBack } = useNoteView()

  return (
    <AnimatedPressable
      style={[StyleSheet.absoluteFill, { backgroundColor: colors.backdrop }]}
      onPress={goBack}
      accessibilityLabel={t('go_back')}
      accessibilityRole="button"
      importantForAccessibility="no"
    />
  )
}

const Title: FC = () => {
  const { note } = useNoteView()
  if (!note.title.trim()) return null

  return (
    <Text
      variant="titleLarge"
      style={styles.title}
      children={note.title.trim()}
      selectable
    />
  )
}

const Content: FC = () => {
  const { note } = useNoteView()
  if (!note.content.trim()) return null

  return <Text variant="bodyMedium" children={note.content.trim()} selectable />
}

const TagList: FC = () => {
  const { note } = useNoteView()
  if (note.tags.length === 0) return null
  return (
    <View style={styles.tag_container}>
      {note.tags.map(tag => {
        return <Chip key={tag.id} children={tag.name} />
      })}
    </View>
  )
}

const TimeLine: FC = () => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { note } = useNoteView()
  const { isPinned, isPrivate, updateAt } = note
  const timeString = t('date_time', { value: updateAt })

  return (
    <View style={styles.divider_container}>
      <Divider style={styles.divider} />
      <Text variant="labelMedium" style={styles.time} children={timeString} />
      {isPinned && (
        <Icon name="bookmark-outline" color={colors.primary} size={14} />
      )}
      {isPrivate && (
        <Icon name="lock-closed-outline" color={colors.primary} size={14} />
      )}
    </View>
  )
}

const Header: FC = () => {
  const { t } = useTranslation()

  const {
    note: { isDeleted },
    currentReminder: reminder,
    openEditor,
    openReminder,
    openDetail,
  } = useNoteView()
  const hasReminder = !!reminder

  return (
    <View style={styles.header}>
      <View style={styles.action_container}>
        {hasReminder && !isDeleted && (
          <Button
            size="medium"
            accessibilityLabel={`${t('reminder')} at: ${t('date_time', {
              value: reminder.timestamp,
            })}`}
            onPress={openReminder}
            icon="notifications-outline"
            title={t('date_time', { value: reminder.timestamp })}
          />
        )}

        <View style={styles.fill} />
        {!hasReminder && !isDeleted && (
          <IconButton
            icon="notifications-outline"
            size="medium"
            accessibilityLabel={t('set_reminder')}
            onPress={openReminder}
          />
        )}
        {!isDeleted && (
          <IconButton
            icon="create-outline"
            size="medium"
            accessibilityLabel={t('edit')}
            onPress={openEditor}
          />
        )}
        <IconButton
          icon="information-circle-outline"
          size="medium"
          onPress={openDetail}
          accessibilityLabel={t('detail_info')}
        />
      </View>
    </View>
  )
}

const TaskList: FC = () => {
  const { note, changeTaskItemStatus } = useNoteView()

  if (note.taskList.length === 0) return null
  return (
    <View style={styles.task_container}>
      {note.taskList.map((task, index) => {
        const status = task.isChecked ? 'checked' : 'unchecked'
        const onPress = () => changeTaskItemStatus(task)
        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={styles.taskItem}
          >
            <Checkbox status={status} />
            <Text children={task.label} />
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: 20,
    alignItems: 'flex-end',
    gap: 4,
  },
  action_container: {
    flexDirection: 'row',
    marginLeft: -24,
    marginRight: -8,
    gap: 8,
    alignItems: 'center',
  },
  tag_container: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  task_container: {},
  content: {
    paddingVertical: 16,
    margin: 16,
    gap: 4,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  note_content: {
    gap: 8,
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  fill: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
  },
  divider: {
    flex: 1,
  },
  divider_container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  time: {
    fontWeight: '500',
  },
  reminder_menu: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export default NoteViewLayout
