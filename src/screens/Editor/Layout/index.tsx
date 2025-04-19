import { FC, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FlatList,
  KeyboardAvoidingView,
  TextInput as RNTextInput,
  StyleSheet,
  View,
} from 'react-native'
import {
  Divider,
  IconButton,
  TextInput,
  Menu,
  Text,
  TextField,
} from 'react-native-chill-ui'
import { useAnimatedRef } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useVisible } from '~/hooks'
import { useNoteEdit } from '../Provider'
import TagSelector from './TagSelector'
import TaskList from './TaskList'

const EditorScreenLayout: FC = () => {
  const { type } = useNoteEdit()

  return (
    <SafeAreaView style={styles.container}>
      <Appbar />
      <KeyboardAvoidingView
        style={styles.keyboard_avoiding_container}
        behavior="padding"
      >
        <View style={styles.content_container}>
          <TitleInput />
          <UpdateTime />
          {type === 'note' && <ContentInput />}
          {type === 'task' && <TaskItemInput />}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const UpdateTime: FC = () => {
  const { t } = useTranslation()
  const { note } = useNoteEdit()

  return (
    <View style={styles.divider_container}>
      <Divider style={styles.divider} />
      <Text
        variant="labelSmall"
        style={styles.time}
        children={t('date_time', { value: note?.updateAt ?? new Date() })}
      />
    </View>
  )
}

const Appbar: FC = () => {
  const { t } = useTranslation()
  const menuIcon = useAnimatedRef<View>()
  const [menuVisible, showMenu, hideMenu] = useVisible()

  const {
    allTags,
    note,
    tags,
    isPrivate,
    isPinned,
    setIsDeleted,
    setIsPrivate,
    setIsPinned,
    setTags,
    openTagEditor,
    openDetail,
    goBack: onBackPress,
  } = useNoteEdit()

  const deleteNote = () => {
    setIsDeleted(true)
    onBackPress()
  }

  const handlePinPress = () => {
    setIsPinned(!isPinned)
  }

  const handlePrivatePress = () => {
    setIsPrivate(!isPrivate)
  }

  return (
    <View style={styles.header}>
      <IconButton
        icon="chevron-back-outline"
        accessibilityLabel={t('go_back')}
        onPress={onBackPress}
      />
      <View style={styles.fill} />
      <TagSelector
        tags={allTags}
        currents={tags}
        onChange={setTags}
        onNewTagPress={openTagEditor}
        label_empty={t('add_tag')}
      />
      <IconButton
        ref={menuIcon}
        icon="ellipsis-vertical-outline"
        onPress={showMenu}
        accessibilityLabel={t('more_action')}
      />
      <Menu
        anchorRef={menuIcon}
        visible={menuVisible}
        onRequestClose={hideMenu}
        style={styles.menu}
      >
        <Menu.Item
          leadingIcon={isPrivate ? 'lock-open-outline' : 'lock-closed-outline'}
          title={t(isPrivate ? 'unlock' : 'lock')}
          disabled={!note}
          onPress={handlePrivatePress}
        />
        <Menu.Item
          leadingIcon="bookmark-outline"
          title={t(isPinned ? 'unPin' : 'pin')}
          disabled={!note}
          onPress={handlePinPress}
        />
        <Menu.Item
          leadingIcon="trash-outline"
          title={t('delete')}
          disabled={!note}
          onPress={deleteNote}
        />
        <Menu.Item
          leadingIcon="information-circle-outline"
          title={t('detail')}
          disabled={!note}
          onPress={openDetail}
        />
      </Menu>
    </View>
  )
}

const TitleInput: FC = () => {
  const { t } = useTranslation()
  const { title, setTitle } = useNoteEdit()

  return (
    <TextInput
      style={styles.title}
      value={title}
      onChangeText={setTitle}
      multiline
      autoCorrect={false}
      numberOfLines={2}
      placeholder={t('title')}
    />
  )
}

const ContentInput: FC = () => {
  const { t } = useTranslation()
  const { content, setContent } = useNoteEdit()

  return (
    <TextInput
      value={content}
      onChangeText={setContent}
      style={styles.content}
      autoCapitalize="sentences"
      autoCorrect={false}
      multiline
      placeholder={t('content_for_note')}
    />
  )
}

const TaskItemInput: FC = () => {
  const { t } = useTranslation()
  const list = useRef<FlatList>(null)
  const input = useRef<RNTextInput>(null)
  const [text, setText] = useState('')

  const {
    taskList,
    changeTaskItemStatus,
    removeTaskItem,
    setTaskItemLabel,
    addTaskItem: onNewItem,
  } = useNoteEdit()

  const handleSubmit = () => {
    if (!text) return
    setText('')
    onNewItem(text)
  }

  return (
    <>
      <TaskList
        ref={list}
        style={styles.task_list}
        onContentSizeChange={() => list.current?.scrollToEnd()}
        accessibilityLabel={t('task_list')}
        items={taskList}
        onCheckPress={changeTaskItemStatus}
        onDeletePress={removeTaskItem}
        onLabelChange={setTaskItemLabel}
      />
      <TextField
        ref={input}
        mode="outlined"
        value={text}
        style={styles.input}
        onChangeText={setText}
        placeholder={t('add_new_item')}
        accessibilityLabel={t('add_new_item')}
        submitBehavior="submit"
        onSubmitEditing={handleSubmit}
        autoCorrect={false}
        autoFocus
        left={
          <TextField.Icon
            icon="add-outline"
            accessibilityLabel={t('add_new_item')}
          />
        }
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
  },
  content_container: {
    flex: 1,
    paddingHorizontal: 16,
    overflow: 'hidden',
    gap: 8,
  },
  keyboard_avoiding_container: {
    flex: 1,
  },
  input: {
    marginBottom: 16,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 8,
    gap: 4,
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
  title: {
    paddingVertical: 0,
    margin: 0,
    fontSize: 24,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    textAlignVertical: 'top',
    paddingVertical: 0,
  },
  toolbar: {
    paddingHorizontal: 8,
  },
  menu: {
    padding: 12,
    gap: 4,
  },
  fill: {
    flex: 1,
  },
  info_item: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  info_item_title: {
    fontWeight: '600',
  },
  task_list: {
    flex: 1,
  },
})

export default EditorScreenLayout
