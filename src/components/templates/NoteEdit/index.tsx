import React, { FC } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Divider, IconButton, Text } from 'react-native-paper'
import { useAnimatedRef } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Input, Menu } from '~/components/atoms'
import { MenuItem, TagMenu } from '~/components/molecules'
import { useNoteEdit } from '~/components/organisms/NoteEdit/Provider'
import { TaskListItemEditor } from '~/components/organisms/NoteEdit/TaskItemInput'
import { EditorToolbar } from '~/components/organisms/NoteEdit/Toolbar'
import { useVisible } from '~/hooks'
import { TaskItemData } from '~/services/database/model/TaskItem'
import { useNoteEditor } from '~/store/noteEdit'

interface Props {
  type: NoteType
}

export const NoteEditLayout: FC<Props> = ({ type }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Appbar />
      <View style={styles.content_container}>
        <TitleInput />
        <UpdateTime />
        {type === 'note' && <ContentInput />}
        {type === 'task' && <TaskItemInput />}
      </View>
      {type === 'note' && <EditorToolbar style={styles.toolbar} />}
    </SafeAreaView>
  )
}

const UpdateTime: FC = () => {
  const updateAt = useNoteEdit(state => state.updateTime)

  return (
    <View style={styles.divider_container}>
      <Divider style={styles.divider} />
      <Text variant="labelSmall" style={styles.time}>
        {(updateAt ?? new Date()).toLocaleString()}
      </Text>
    </View>
  )
}

const Appbar: FC = () => {
  const menuIcon = useAnimatedRef<View>()
  const [menuVisible, showMenu, hideMenu] = useVisible()

  const onBackPress = useNoteEdit(state => state.onBackPress)
  const tags = useNoteEdit(state => state.tags)
  const onNewTagSubmit = useNoteEdit(state => state.onNewTagSubmit)

  const currentTags = useNoteEditor(state => state.tags)
  const isPrivate = useNoteEditor(state => state.isPrivate)
  const isPinned = useNoteEditor(state => state.isPinned)
  const update = useNoteEditor(state => state.update)

  const handlePinPress = () => {
    update('isPinned')(!isPinned)
    hideMenu()
  }

  const handlePrivatePress = () => {
    update('isPrivate')(!isPrivate)
    hideMenu()
  }

  return (
    <View style={styles.header}>
      <IconButton icon="angle-left" onPress={onBackPress} />
      <View style={styles.fill} />
      <IconButton icon="bookmark" />
      <View style={styles.tag_container}>
        <TagMenu
          tags={tags}
          currents={currentTags}
          onChange={update('tags')}
          onNewTagSubmit={onNewTagSubmit}
        />
      </View>
      <IconButton ref={menuIcon} icon="menu-dots-vertical" onPress={showMenu} />
      <Menu
        anchorRef={menuIcon}
        visible={menuVisible}
        onRequestClose={hideMenu}
        onDismiss={hideMenu}
        style={styles.menu}
      >
        <MenuItem
          leadingIcon={isPrivate ? 'unlock' : 'lock'}
          title={isPrivate ? 'Unlock' : 'Lock'}
          onPress={handlePrivatePress}
        />
        <MenuItem
          leadingIcon="thumbtack"
          title={isPinned ? 'Unpin' : 'Pin'}
          onPress={handlePinPress}
        />
        <MenuItem leadingIcon="search" title="Search" />
        <MenuItem leadingIcon="trash" title="Delete" />
        <MenuItem leadingIcon="share" title="Share" />
        <MenuItem leadingIcon="info" title="Info" />
      </Menu>
    </View>
  )
}

const TitleInput: FC = () => {
  const title = useNoteEditor(state => state.title)
  const update = useNoteEditor(state => state.update)

  return (
    <Input
      style={styles.title}
      value={title}
      onChangeText={update('title')}
      multiline
      numberOfLines={2}
      placeholder="Title"
    />
  )
}

const ContentInput: FC = () => {
  const content = useNoteEditor(state => state.content)
  const update = useNoteEditor(state => state.update)

  return (
    <Input
      value={content}
      onChangeText={update('content')}
      style={styles.content}
      autoCapitalize="sentences"
      multiline
      placeholder="Content for note"
    />
  )
}

const TaskItemInput: FC = () => {
  const taskItems = useNoteEditor(state => state.taskList)
  const setTaskItems = useNoteEditor(state => state.update('taskList'))

  const onCheckPress = (item: TaskItemData) => {
    switch (item.status) {
      case 'checked':
        item.status = 'unchecked'
        break
      case 'unchecked':
        item.status = 'checked'
        break
      case 'indeterminate':
        break
    }
    setTaskItems([...taskItems])
  }

  const onDeletePress = (item: TaskItemData, index: number) => {
    taskItems.splice(index, 1)
    setTaskItems([...taskItems])
  }

  const onDisablePress = (item: TaskItemData) => {
    item.status = item.status == 'indeterminate' ? 'unchecked' : 'indeterminate'
    setTaskItems([...taskItems])
  }

  const onLabelChange = (item: TaskItemData, label: string) => {
    item.label = label
    setTaskItems([...taskItems])
  }

  const onNewItem = (label: string) => {
    taskItems.push({ label, status: 'unchecked' })
    setTaskItems([...taskItems])
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      automaticallyAdjustKeyboardInsets
      showsVerticalScrollIndicator={false}
      keyboardDismissMode="interactive"
    >
      <TaskListItemEditor
        items={taskItems}
        onCheckPress={onCheckPress}
        onDeletePress={onDeletePress}
        onDisablePress={onDisablePress}
        onLabelChange={onLabelChange}
        onNewItem={onNewItem}
      />
    </ScrollView>
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
    gap: 8,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
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
    fontSize: 24,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    textAlignVertical: 'top',
  },
  toolbar: {
    paddingHorizontal: 8,
  },
  tag_container: {
    gap: 8,
    flexDirection: 'row',
  },
  menu: {
    padding: 12,
    gap: 4,
  },
  fill: {
    flex: 1,
  },
})
