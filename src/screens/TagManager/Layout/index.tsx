import { Tag } from 'note-app-database'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ListRenderItem, StyleSheet, View } from 'react-native'
import { Actionbar, Appbar, Button, Dialog, Text } from 'react-native-chill-ui'
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
  LinearTransition,
  ZoomOutLeft,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SelectionAppbar } from '~/components'
import { useVisible } from '~/hooks'
import { Haptick } from '~/services/haptick'
import { useTagManager } from '../Provider'
import { createTagItemWithCount } from '../query'
import TagListItem from './TagListItem'
import TagListEmpty from './TagListEmpty'

const TagManagerLayout: FC = () => {
  const { mode } = useTagManager()

  return (
    <View style={styles.container}>
      {mode === 'default' && <TAppbar />}
      {mode === 'select' && <TSelectionAppbar />}
      <TContent />
      {mode === 'default' && <BottomSpace />}
      {mode === 'select' && <TActionBar />}
    </View>
  )
}

const TSelectionAppbar = () => {
  const insets = useSafeAreaInsets()
  const {
    setMode,
    selectAll: toggleCheckAll,
    tags,
    selecteds,
  } = useTagManager()
  const numOfItem = selecteds === 'all' ? tags.length : selecteds.size
  const close = () => setMode('default')

  return (
    <SelectionAppbar
      entering={FadeInUp}
      exiting={FadeOutUp}
      onClosePress={close}
      onCheckAllPress={toggleCheckAll}
      numOfItem={numOfItem}
      style={{ paddingTop: insets.top }}
    />
  )
}

const TAppbar: FC = () => {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const { goBack, openTagEditor } = useTagManager()

  const handleNewTagPress = () => {
    openTagEditor()
    Haptick.light()
  }

  return (
    <Appbar style={{ paddingTop: insets.top }}>
      <Appbar.BackAction onPress={goBack} />
      <Appbar.Title children={t('tag_label')} />
      <Appbar.Action
        icon="add-outline"
        accessibilityLabel={t('add_new_tag')}
        visible={true}
        onPress={handleNewTagPress}
      />
    </Appbar>
  )
}

const TActionBar = () => {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const { togglePinTags, deleteTags, setMode, openTagEditor, selecteds } =
    useTagManager()

  const isEmpty = selecteds !== 'all' && selecteds.size === 0
  const isSingle = selecteds !== 'all' && selecteds.size === 1

  const [dialogVisible, showDialog, hideDialog] = useVisible()

  const handleDeletePress = () => {
    setMode('default')
    deleteTags()
    hideDialog()
    Haptick.light()
  }

  const handleCancelPress = () => {
    hideDialog()
    Haptick.light()
  }

  const handleEditPress = () => {
    openTagEditor()
    Haptick.light()
  }

  const handlePinPess = () => {
    setMode('default')
    togglePinTags()
    Haptick.light()
  }

  return (
    <>
      <Actionbar
        entering={FadeInDown}
        exiting={FadeOutDown}
        style={{ paddingBottom: insets.bottom }}
      >
        <Actionbar.Action
          icon="bookmark-outline"
          title={t('pin')}
          disabled={isEmpty}
          onPress={handlePinPess}
        />
        <Actionbar.Action
          icon="trash-outline"
          title={t('delete')}
          disabled={isEmpty}
          onPress={showDialog}
        />
        <Actionbar.Action
          icon="create-outline"
          title={t('edit')}
          disabled={!isSingle}
          onPress={handleEditPress}
        />
      </Actionbar>
      <Dialog visible={dialogVisible} onRequestClose={hideDialog}>
        <Dialog.Title children={t('confirm_delete')} />
        <Dialog.Content>
          <Text
            variant="bodyMedium"
            children={t('tag_manager_confirm_delete_description')}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            mode="contained"
            onPress={handleDeletePress}
            title={t('delete')}
          />
          <Button
            mode="outlined"
            onPress={handleCancelPress}
            title={t('cancel')}
          />
        </Dialog.Actions>
      </Dialog>
    </>
  )
}

const BottomSpace: FC = () => {
  const { bottom } = useSafeAreaInsets()
  return <View style={{ height: bottom }} />
}

const ListItem = createTagItemWithCount(TagListItem)

const TContent: FC = () => {
  const { tags, mode, setMode, select, selecteds } = useTagManager()

  const renderTag: ListRenderItem<Tag> = ({ item }) => {
    const isSelected = selecteds === 'all' || selecteds.has(item.id)

    const onPress = () => {
      if (mode === 'select') select(item)
    }

    const onLongPress = () => {
      setMode('select')
      select(item)
      Haptick.medium()
    }

    return (
      <ListItem
        data={item}
        tagId={item.id}
        onPress={onPress}
        selectable={mode === 'select'}
        isSelected={isSelected}
        onLongPress={onLongPress}
        style={styles.item}
        exiting={ZoomOutLeft}
      />
    )
  }

  return (
    <Animated.FlatList
      data={tags}
      renderItem={renderTag}
      itemLayoutAnimation={LinearTransition}
      ListEmptyComponent={TagListEmpty}
      keyExtractor={item => item.id}
      style={styles.tag_list}
      contentContainerStyle={styles.tag_content_container}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
  },
  tag_list: {
    flex: 1,
  },
  tag_content_container: {
    flexGrow: 1,
    gap: 8,
    paddingHorizontal: 16,
  },
  item: {
    flex: 1,
  },
  dialog: {
    justifyContent: 'flex-end',
  },
})

export default TagManagerLayout
