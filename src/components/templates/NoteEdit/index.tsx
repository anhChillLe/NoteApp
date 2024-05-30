import React, { FC } from 'react'
import { ModalProps, ScrollView, StyleSheet, View } from 'react-native'
import { Button, Divider, IconButton, Text, useTheme } from 'react-native-paper'
import { LinearTransition, useAnimatedRef } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AnimatedPaper } from '~/components/Animated'
import { Dialog, Input, Menu } from '~/components/atoms'
import { MenuItem, TagMenu } from '~/components/molecules'
import { useNoteEdit } from '~/components/organisms/NoteEdit/Provider'
import { TaskListItemEditor } from '~/components/organisms/NoteEdit/TaskItemInput'
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
    </SafeAreaView>
  )
}

const UpdateTime: FC = () => {
  const data = useNoteEdit(state => state.data)

  return (
    <View style={styles.divider_container}>
      <Divider style={styles.divider} />
      <Text variant="labelSmall" style={styles.time}>
        {(data?.updateAt ?? new Date()).toLocaleString()}
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
  const update = useNoteEditor(state => state.update)

  const deleteNote = () => update('isDeleted')(true)

  const handlePinPress = () => {
    update('isPinned')(!isPinned)
    hideMenu()
  }

  const handlePrivatePress = () => {
    update('isPrivate')(!isPrivate)
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
      <AnimatedPaper.IconButton icon="bookmark" layout={LinearTransition} />
      <TagMenu
        tags={tags}
        currents={currentTags}
        onChange={update('tags')}
        onNewTagSubmit={onNewTagSubmit}
      />
      <IconButton ref={menuIcon} icon="menu-dots-vertical" onPress={showMenu} />
      <InfoCard
        visible={infoVisible}
        onDismiss={hideInfo}
        onRequestClose={hideInfo}
      />
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
        <MenuItem leadingIcon="share" title="Share" disabled={!data} />
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

const InfoCard: FC<ModalProps> = props => {
  const { colors, roundness } = useTheme()
  const data = useNoteEdit(state => state.data?.data)

  if (!data) return null

  return (
    <Dialog
      {...props}
      contentContainerStyle={[
        styles.info_card_content,
        {
          borderRadius: roundness * 4,
          backgroundColor: colors.background,
        },
      ]}
    >
      <Text variant="titleLarge">Detail info</Text>
      <View style={styles.info_item}>
        <Text>Create at:</Text>
        <Text>{data.createAt.toLocaleString()}</Text>
      </View>
      <View style={styles.info_item}>
        <Text>Last update:</Text>
        <Text>{data.updateAt.toLocaleString()}</Text>
      </View>
      <View style={styles.info_action_container}>
        <Button onPress={props.onDismiss}>OK</Button>
      </View>
    </Dialog>
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
      autoCorrect={false}
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
      autoCorrect={false}
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
  info_card_content: {
    padding: 16,
    width: '80%',
    gap: 8,
    alignItems: 'stretch',
  },
  info_item: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  info_action_container: {
    flexDirection: 'row-reverse',
  },
})
