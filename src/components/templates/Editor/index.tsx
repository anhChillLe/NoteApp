import moment from 'moment'
import React, { FC, memo } from 'react'
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native'
import { Button, Divider, IconButton, Text } from 'react-native-paper'
import { useAnimatedRef } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'
import { useNoteEdit } from '~/components/Provider'
import { Input, Menu } from '~/components/atoms'
import { ModalProps } from '~/components/atoms/Modal'
import { Dialog, MenuItem, TagSelector } from '~/components/molecules'
import { TaskList } from '~/components/organisms'
import { useVisible } from '~/hooks'
import useNoteEditor from '~/screens/Editor/store'
import { timeAgo } from '~/utils'

const EditorScreenLayout: FC = () => {
  const type = useNoteEditor(state => state.type)

  return (
    <SafeAreaView style={styles.container}>
      <Appbar />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={16}
      >
        <View style={[styles.content_container]}>
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
  const data = useNoteEdit(state => state.data)

  return (
    <View style={styles.divider_container}>
      <Divider style={styles.divider} />
      <Text variant="labelSmall" style={styles.time}>
        {timeAgo(data?.updateAt ?? new Date())}
      </Text>
    </View>
  )
}

const Appbar: FC = () => {
  const menuIcon = useAnimatedRef<View>()
  const [menuVisible, showMenu, hideMenu] = useVisible()
  const [infoVisible, showInfo, hideInfo] = useVisible()

  const onBackPress = useNoteEdit(state => state.onBackPress)
  const tags = useNoteEdit(state => state.tags)
  const onNewTagSubmit = useNoteEdit(state => state.onNewTagSubmit)
  const data = useNoteEdit(state => state.data)

  const currentTags = useNoteEditor(state => state.tags)
  const isPrivate = useNoteEditor(state => state.isPrivate)
  const isPinned = useNoteEditor(state => state.isPinned)
  const setIsDeleted = useNoteEditor(state => state.setIsDeleted)
  const setIsPrivate = useNoteEditor(state => state.setIsPrivate)
  const setIsPinned = useNoteEditor(state => state.setIsPinned)
  const setTags = useNoteEditor(state => state.setTags)

  const deleteNote = () => setIsDeleted(true)

  const handlePinPress = () => {
    setIsPinned(!isPinned)
    hideMenu()
  }

  const handlePrivatePress = () => {
    setIsPrivate(!isPrivate)
    hideMenu()
  }

  const handleShowInfo = () => {
    hideMenu()
    showInfo()
  }

  return (
    <View style={styles.header}>
      <IconButton icon="angle-left" onPress={onBackPress} />
      <View style={styles.fill} />
      <TagSelector
        tags={tags}
        currents={currentTags}
        onChange={setTags}
        onNewTagSubmit={onNewTagSubmit}
      />
      <IconButton ref={menuIcon} icon="menu-dots-vertical" onPress={showMenu} />
      <InfoCard
        visible={infoVisible}
        dismissable
        dismissableBackButton
        onRequestClose={hideInfo}
      />
      <Menu
        anchorRef={menuIcon}
        visible={menuVisible}
        onRequestClose={hideMenu}
        style={styles.menu}
      >
        <MenuItem
          leadingIcon={isPrivate ? 'unlock' : 'lock'}
          title={isPrivate ? 'Unlock' : 'Lock'}
          disabled={!data}
          onPress={handlePrivatePress}
        />
        <MenuItem
          leadingIcon="thumbtack"
          title={isPinned ? 'Unpin' : 'Pin'}
          disabled={!data}
          onPress={handlePinPress}
        />
        <MenuItem
          leadingIcon="trash"
          title="Delete"
          disabled={!data}
          onPress={deleteNote}
        />
        <MenuItem
          leadingIcon="info"
          title="Info"
          disabled={!data}
          onPress={handleShowInfo}
        />
      </Menu>
    </View>
  )
}

const InfoCard: FC<Omit<ModalProps, 'children'>> = props => {
  const data = useNoteEdit(state => state.data)
  if (!data) return null

  return (
    <Dialog {...props}>
      <Dialog.Title children="Detail info" />
      <Dialog.Content>
        <View style={styles.info_item}>
          <Text style={styles.info_item_title}>Create at:</Text>
          <Text>{moment(data.createAt).format('DD/MM/YYYY HH:mm:ss')}</Text>
        </View>
        <View style={styles.info_item}>
          <Text style={styles.info_item_title}>Last update:</Text>
          <Text>{moment(data.updateAt).format('DD/MM/YYYY HH:mm:ss')}</Text>
        </View>
      </Dialog.Content>
      <Dialog.Actions>
        <Button mode="contained-tonal" onPress={props.onRequestClose}>
          OK
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

const TitleInput: FC = () => {
  const title = useNoteEditor(state => state.title)
  const setTitle = useNoteEditor(state => state.setTitle)

  return (
    <Input
      style={styles.title}
      value={title}
      onChangeText={setTitle}
      multiline
      autoCorrect={false}
      numberOfLines={2}
      placeholder="Title"
    />
  )
}

const ContentInput: FC = () => {
  const content = useNoteEditor(state => state.content)
  const setContent = useNoteEditor(state => state.setContent)

  return (
    <Input
      value={content}
      onChangeText={setContent}
      style={styles.content}
      autoCapitalize="sentences"
      autoCorrect={false}
      multiline
      placeholder="Content for note"
    />
  )
}

const TaskItemInput: FC = () => {
  const inputProps = useNoteEditor(
    useShallow(state => ({
      items: state.taskList,
      onCheckPress: state.changeTaskItemStatus,
      onDeletePress: state.removeTaskItem,
      onDisablePress: state.disableTaskItem,
      onLabelChange: state.setTaskItemLabel,
      onNewItem: state.addTaskItem,
    })),
  )

  return <TaskList style={styles.task_list} {...inputProps} />
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
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
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

export default memo(EditorScreenLayout)
