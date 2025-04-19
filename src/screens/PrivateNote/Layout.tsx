import { MasonryListRenderItem } from '@shopify/flash-list'
import { Note, Tag } from 'note-app-database'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'
import {
  Actionbar,
  Appbar,
  BottomAppbar,
  Button,
  ContentScrollProvider,
  Dialog,
  DragProvider,
  Text,
  createDropableItem,
  useContentScroll,
  useDrag,
} from 'react-native-chill-ui'
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
  clamp,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  AnimatedMasonryNoteList,
  NoteListEmpty,
  NoteListItem,
  SelectionAppbar,
  TagList,
} from '~/components'
import { useVisible } from '~/hooks'
import { useSetting } from '~/app/providers/settings'
import { Haptick } from '~/services/haptick'
import { usePrivateNote } from './Provider'

const PrivateScreenLayout: FC = () => {
  const { mode } = usePrivateNote()
  const isInSelectMode = mode === 'select'
  return (
    <ContentScrollProvider>
      <DragProvider>
        <View style={styles.container}>
          {isInSelectMode ? <PSlectionAppBar /> : <PAppBar />}
          <View style={styles.content}>
            <Header />
            <ContentList />
          </View>
          {isInSelectMode ? <PActionBar /> : <PBottomAppbar />}
        </View>
      </DragProvider>
    </ContentScrollProvider>
  )
}

interface ExtraData {
  isInSelectMode: boolean
  openEditor: (item: Note) => void
  extras: Tag
  selecteds: Set<string> | 'all'
  select: (item: Note) => void
  setMode: (mode: 'default' | 'select') => void
  addTagToNote: (tag: Tag, note: Note) => void
}

const renderItem: MasonryListRenderItem<Note> = ({ item, extraData }) => {
  const {
    isInSelectMode,
    openEditor,
    extras,
    selecteds,
    select,
    addTagToNote,
    setMode,
  } = extraData as ExtraData

  const onPress = () => {
    if (isInSelectMode) {
      select(item)
      Haptick.light()
    } else openEditor(item)
  }

  const onLongPress = () => {
    setMode('select')
    select(item)
    Haptick.light()
  }

  const onDropIn = () => {
    if (extras) {
      addTagToNote(extras, item)
      Haptick.light()
    }
  }

  const isSelected = selecteds === 'all' || selecteds.has(item.id)

  return (
    <DropableNoteItem
      data={item}
      style={styles.list_item}
      maxLineOfContent={6}
      maxLineOfTitle={1}
      selectable={isInSelectMode}
      isSelected={isSelected}
      onPress={onPress}
      onLongPress={onLongPress}
      onDropIn={onDropIn}
    />
  )
}

const ContentList: FC = () => {
  const { notes, openEditor, selecteds, select, setMode, mode, addTagToNote } =
    usePrivateNote()
  const isInSelectMode = mode === 'select'

  const { event } = useContentScroll()
  const scrollHandler = useAnimatedScrollHandler(e => {
    // eslint-disable-next-line react-compiler/react-compiler
    event.value = e.contentOffset
  }, [])
  const { extras } = useDrag<Tag>()
  const { numOfColumns } = useSetting()
  const windowDimension = useWindowDimensions()
  const numColumns = numOfColumns ?? Math.round(windowDimension.width / 200)

  const extraData = {
    isInSelectMode,
    openEditor,
    extras,
    selecteds,
    select,
    addTagToNote,
    setMode,
  }

  if (notes.isEmpty()) {
    return (
      <Animated.ScrollView
        contentContainerStyle={styles.list_content}
        onScroll={scrollHandler}
      >
        <NoteListEmpty style={styles.list_empty} />
      </Animated.ScrollView>
    )
  }

  return (
    <AnimatedMasonryNoteList
      data={notes}
      extraData={extraData}
      numColumns={numColumns}
      estimatedItemSize={212}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onScroll={scrollHandler}
      contentContainerStyle={styles.list_content}
    />
  )
}

const PTagList: FC = () => {
  const { tags, currentTagId, changeCurrentTagId } = usePrivateNote()
  return (
    <TagList
      data={tags}
      style={styles.tag_list}
      dragable={true}
      currentTagId={currentTagId}
      onTagChange={changeCurrentTagId}
    />
  )
}

// FlashList not support sticky for header
const Header: FC = () => {
  const { t } = useTranslation()
  const { event } = useContentScroll()

  const headerStyle = useAnimatedStyle(() => {
    const y = event.value.y

    return {
      transform: [{ translateY: -clamp(y, -32, HEADER_HEIGHT) }],
    }
  }, [])

  const headerTitleStyle = useAnimatedStyle(() => {
    const y = event.value.y

    return {
      opacity: interpolate(y, [0, HEADER_HEIGHT], [1, 0]),
    }
  }, [])

  return (
    <Animated.View style={[styles.header, headerStyle]}>
      <Animated.View style={[styles.header_title, headerTitleStyle]}>
        <Text variant="displayMedium" children={t('private_note')} />
      </Animated.View>
      <PTagList />
    </Animated.View>
  )
}

const PBottomAppbar: FC = () => {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()
  const { openNewNoteEditor, openNewTaskEditor } = usePrivateNote()

  return (
    <BottomAppbar
      entering={FadeInDown.duration(200)}
      exiting={FadeOutDown.duration(200)}
      style={{ paddingBottom: bottom + 8 }}
    >
      <BottomAppbar.Action
        icon="add-outline"
        accessibilityLabel={t('add_new_note')}
        size="xlarge"
        mode="contained"
        onPress={() => {
          openNewNoteEditor()
          Haptick.light()
        }}
      />
      <BottomAppbar.Action
        icon="checkbox-outline"
        accessibilityLabel={t('add_new_task')}
        onPress={() => {
          openNewTaskEditor()
          Haptick.light()
        }}
      />
    </BottomAppbar>
  )
}

const PSlectionAppBar: FC = () => {
  const insets = useSafeAreaInsets()
  const { setMode, selectAll, selecteds, notes } = usePrivateNote()
  const close = () => setMode('default')
  const numOfItem = (() => {
    if (selecteds === 'all') {
      return notes.length
    } else {
      return selecteds.size
    }
  })()

  return (
    <SelectionAppbar
      entering={FadeInUp.duration(200)}
      exiting={FadeOutUp.duration(200)}
      onClosePress={close}
      onCheckAllPress={selectAll}
      numOfItem={numOfItem}
      style={[styles.appbar, { paddingTop: insets.top }]}
    />
  )
}

const PAppBar: FC = () => {
  const { t } = useTranslation()
  const { goBack } = usePrivateNote()
  const insets = useSafeAreaInsets()
  const { event } = useContentScroll()

  const appBarTitleStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(event.value.y, [0, HEADER_HEIGHT], [0, 1]),
    }
  }, [])

  return (
    <Appbar
      entering={FadeInUp.duration(200)}
      exiting={FadeOutUp.duration(200)}
      style={[styles.appbar, { paddingTop: insets.top }]}
    >
      <Appbar.BackAction onPress={goBack} />
      <Appbar.Title children={t('private_note')} style={appBarTitleStyle} />
    </Appbar>
  )
}

const PActionBar: FC = () => {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const { deleteItems, removeFromPrivate, selecteds } = usePrivateNote()
  const isEmpty = selecteds !== 'all' && selecteds.size === 0
  const [visible, showDialog, hideDialog] = useVisible()

  const handleDelete = () => {
    deleteItems()
    Haptick.light()
  }

  return (
    <>
      <Actionbar
        entering={FadeInDown.duration(200)}
        exiting={FadeOutDown.duration(200)}
        style={{ paddingBottom: insets.bottom }}
      >
        <Actionbar.Action
          icon="refresh-outline"
          title={t('remove')}
          disabled={isEmpty}
          onPress={removeFromPrivate}
        />
        <Actionbar.Action
          icon="trash-outline"
          title={t('delete')}
          disabled={isEmpty}
          onPress={showDialog}
        />
      </Actionbar>
      <Dialog
        visible={visible}
        onRequestClose={hideDialog}
        dismissable
        dismissableBackButton
      >
        <Dialog.Title children={t('confirm_delete')} />
        <Dialog.Content>
          <Text
            variant="bodyMedium"
            children={t('private_confirm_delete_description')}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button mode="contained" onPress={handleDelete} title={t('delete')} />
          <Button mode="outlined" onPress={hideDialog} title={t('cancel')} />
        </Dialog.Actions>
      </Dialog>
    </>
  )
}

const DropableNoteItem = createDropableItem(NoteListItem)

const keyExtractor = (item: Note) => item.id

const HEADER_HEIGHT: number = 96
const TAG_LIST_HEIGHT: number = 52

const styles = StyleSheet.create({
  appbar: {
    zIndex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
  },
  list_content: {
    paddingHorizontal: 16 - 4,
    paddingTop: HEADER_HEIGHT + TAG_LIST_HEIGHT - 4,
  },
  list_item: {
    margin: 4,
  },
  list_empty: {
    paddingTop: HEADER_HEIGHT + TAG_LIST_HEIGHT,
  },
  tag_list: {
    height: TAG_LIST_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    height: HEADER_HEIGHT + TAG_LIST_HEIGHT,
    zIndex: 1,
  },
  header_title: {
    height: HEADER_HEIGHT,
    justifyContent: 'center',
  },
  dialog_checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
})

export default PrivateScreenLayout
