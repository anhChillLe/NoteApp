import { MasonryListRenderItem } from '@shopify/flash-list'
import { Note } from 'note-app-database'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'
import {
  Actionbar,
  Appbar,
  Button,
  ContentScrollProvider,
  Dialog,
  Text,
  useContentScroll,
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
import { useSetting } from '~/app/providers/settings'
import {
  AnimatedMasonryNoteList,
  NoteListEmpty,
  NoteListItem,
  SelectionAppbar,
} from '~/components'
import { useVisible } from '~/hooks'
import { Haptick } from '~/services/haptick'
import { useTrash } from './Provider'

const TrashScreenLayout: FC = () => {
  const { mode } = useTrash()

  return (
    <ContentScrollProvider>
      <View style={styles.container}>
        {mode === 'select' && <TSelectionAppBar />}
        {mode === 'default' && <TAppBar />}
        <View style={styles.content}>
          <Header />
          <ContentList />
        </View>
        {mode === 'select' && <TActionBar />}
      </View>
    </ContentScrollProvider>
  )
}

const TAppBar: FC = () => {
  const { t } = useTranslation()
  const { goBack } = useTrash()
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
      <Appbar.Title children={t('trash')} style={appBarTitleStyle} />
    </Appbar>
  )
}

const ContentList: FC = () => {
  const insets = useSafeAreaInsets()
  const { notes, openEditor, setMode, mode, selecteds, select } = useTrash()
  const isInSelectMode = mode === 'select'
  const { numOfColumns } = useSetting()
  const windowDimension = useWindowDimensions()
  const numColumns = numOfColumns ?? Math.round(windowDimension.width / 200)
  const extraData = { selecteds, numColumns }
  const { event } = useContentScroll()
  const scrollHandler = useAnimatedScrollHandler(e => {
    // eslint-disable-next-line react-compiler/react-compiler
    event.value = e.contentOffset
  }, [])

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

  const renderItem: MasonryListRenderItem<Note> = ({ item }) => {
    const onPress = () => {
      if (isInSelectMode) select(item)
      else openEditor(item)
    }

    const onLongPress = () => {
      setMode('select')
      select(item)
      Haptick.medium()
    }

    const isSelected = selecteds === 'all' || selecteds.has(item.id)

    return (
      <NoteListItem
        data={item}
        style={styles.list_item}
        maxLineOfContent={6}
        maxLineOfTitle={1}
        selectable={isInSelectMode}
        isSelected={isSelected}
        onPress={onPress}
        onLongPress={onLongPress}
      />
    )
  }

  return (
    <AnimatedMasonryNoteList
      data={notes}
      extraData={extraData}
      numColumns={numColumns}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      estimatedItemSize={200}
      contentContainerStyle={{
        ...styles.list_content,
        paddingBottom: insets.bottom,
      }}
      onScroll={scrollHandler}
    />
  )
}
const Header: FC = () => {
  const { t } = useTranslation()
  const { event } = useContentScroll()
  const headerStyle = useAnimatedStyle(() => {
    const y = event.value.y

    return {
      opacity: interpolate(y, [0, HEADER_HEIGHT], [1, 0]),
      transform: [{ translateY: -clamp(y, -32, HEADER_HEIGHT) }],
    }
  }, [])

  return (
    <Animated.View style={[styles.header, headerStyle]}>
      <Text variant="displayMedium" children={t('trash')} />
    </Animated.View>
  )
}

const keyExtractor = (item: Note) => item.id

const TSelectionAppBar: FC = () => {
  const insets = useSafeAreaInsets()
  const { setMode, selectAll, notes, selecteds } = useTrash()
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
      style={{ paddingTop: insets.top }}
    />
  )
}

const TActionBar: FC = () => {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const { deleteNotes, setMode, restoreNotes } = useTrash()
  const [visible, show, hide] = useVisible()

  const handleDeletePress = () => {
    deleteNotes()
    Haptick.light()
    hide()
    setMode('default')
  }

  const handleRestorePress = () => {
    restoreNotes()
    Haptick.light()
    setMode('default')
  }

  return (
    <>
      <Actionbar
        entering={FadeInDown.duration(200)}
        exiting={FadeOutDown.duration(200)}
        style={{ paddingBottom: insets.bottom + 8 }}
      >
        <Actionbar.Action
          icon="refresh-outline"
          title={t('restore')}
          onPress={handleRestorePress}
        />
        <Actionbar.Action
          icon="trash-outline"
          title={t('delete')}
          onPress={show}
        />
      </Actionbar>
      <Dialog
        visible={visible}
        onRequestClose={hide}
        dismissable
        dismissableBackButton
      >
        <Dialog.Title children={t('confirm_delete')} />
        <Dialog.Content>
          <Text
            variant="bodyMedium"
            children={t('trash_confirm_delete_description')}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            mode="contained"
            onPress={handleDeletePress}
            title={t('delete')}
          />
          <Button mode="outlined" onPress={hide} title={t('cancel')} />
        </Dialog.Actions>
      </Dialog>
    </>
  )
}
const HEADER_HEIGHT: number = 96

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    alignItems: 'stretch',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
  },
  appbar: {
    zIndex: 1,
  },
  list_content: {
    paddingTop: HEADER_HEIGHT - 4,
    paddingHorizontal: 16 - 4,
  },
  list_item: {
    margin: 4,
  },
  list_empty: {
    paddingTop: HEADER_HEIGHT,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: HEADER_HEIGHT,
  },
  dialog_checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
})

export default TrashScreenLayout
