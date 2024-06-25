import { MasonryListRenderItem } from '@shopify/flash-list'
import { FC, memo, useMemo } from 'react'
import { StyleSheet, View, useWindowDimensions } from 'react-native'
import { Button, Checkbox, Text } from 'react-native-paper'
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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'
import {
  AnimatedMasonryNoteList,
  AnimatedPressable,
} from '~/components/Animated'
import {
  ContentScrollProvider,
  DragProvider,
  createDropableItem,
  useContentScroll,
  useDrag,
  usePrivateNote,
} from '~/components/Provider'
import { Dialog, NoteListItem } from '~/components/molecules'
import {
  ActionBar,
  Appbar,
  BottomAppbar,
  NoteListEmpty,
  SelectionAppbar,
  TagList,
} from '~/components/organisms'
import { useVisible } from '~/hooks'
import usePrivateState from '~/screens/PrivateStack/PrivateNote/store'
import { Note, Tag } from '~/services/database/model'

const PrivateScreenLayout: FC = () => {
  const isInSelectMode = usePrivateState(state => state.mode === 'select')

  return (
    <ContentScrollProvider>
      <DragProvider>
        <SafeAreaView style={styles.container} edges={['left', 'right']}>
          {isInSelectMode ? <PSlectionAppBar /> : <PAppBar />}
          <View style={styles.content}>
            <Header />
            <ContentList />
          </View>

          {isInSelectMode ? <PActionBar /> : <PBottomAppbar />}
        </SafeAreaView>
      </DragProvider>
    </ContentScrollProvider>
  )
}

const ContentList: FC = memo(
  () => {
    const notes = usePrivateNote(state => state.notes)
    const openEditor = usePrivateNote(state => state.openEditor)

    const { selecteds, select, isInSelectMode, addTagToNote } = usePrivateState(
      useShallow(state => ({
        selecteds: state.selecteds,
        select: state.select,
        isInSelectMode: state.mode === 'select',
        addTagToNote: state.addTagToNote,
      })),
    )

    const { event } = useContentScroll()

    const scrollHandler = useAnimatedScrollHandler(e => {
      event.value = e.contentOffset
    }, [])

    const { extras } = useDrag<Tag>()

    const window = useWindowDimensions()
    const numColumns = notes.length === 0 ? 1 : Math.round(window.width / 200)
    const extraData = useMemo(
      () => ({ selecteds, extras, numColumns }),
      [selecteds, extras, numColumns],
    )

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

    const renderItem: MasonryListRenderItem<Note> = ({ item, columnIndex }) => {
      const onPress = () => {
        if (isInSelectMode) select(item)
        else openEditor(item)
      }

      const onLongPress = () => {
        select(item)
      }

      const onDropIn = () => {
        if (extras) {
          addTagToNote(extras, item)
        }
      }

      const isSelected = selecteds.some(it => it.id === item.id)

      return (
        <MemoNoteItem
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
  },
  () => true,
)

const PTagList: FC = memo(
  () => {
    const tags = usePrivateNote(state => state.tags)
    const currentTagId = usePrivateNote(state => state.currentTagId)
    const changeCurrentTagId = usePrivateNote(state => state.changeCurrentTagId)

    return (
      <TagList
        data={tags}
        style={styles.tag_list}
        dragable={true}
        currentTagId={currentTagId}
        onTagChange={changeCurrentTagId}
      />
    )
  },
  () => true,
)

/**
 * FlashList not support sticky for header
 */
const Header: FC = memo(
  () => {
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
          <Text variant="displayMedium">Private notes</Text>
        </Animated.View>
        <PTagList />
      </Animated.View>
    )
  },
  () => true,
)

const PBottomAppbar: FC = memo(
  () => {
    const { bottom } = useSafeAreaInsets()
    const openNoteEditor = usePrivateNote(state => state.openNewNoteEditor)
    const openTaskEditor = usePrivateNote(state => state.openNewTaskEditor)

    const actions = [
      {
        icon: 'plus-small',
        primary: true,
        onPress: openNoteEditor,
      },
      {
        icon: 'checkbox',
        onPress: openTaskEditor,
      },
    ]

    return (
      <BottomAppbar
        actions={actions}
        entering={FadeInDown.duration(200)}
        exiting={FadeOutDown.duration(200)}
        style={{ paddingBottom: bottom }}
      />
    )
  },
  () => true,
)

const PSlectionAppBar: FC = memo(
  () => {
    const notes = usePrivateNote(state => state.notes)
    const insets = useSafeAreaInsets()
    const { selecteds, setMode, setSelecteds } = usePrivateState()

    const checkAll = () => {
      setSelecteds(notes.map(it => it))
    }

    const close = () => setMode('default')

    return (
      <SelectionAppbar
        entering={FadeInUp.duration(200)}
        exiting={FadeOutUp.duration(200)}
        onClosePress={close}
        onCheckAllPress={checkAll}
        numOfItem={selecteds.length}
        style={[styles.appbar, { paddingTop: insets.top }]}
      />
    )
  },
  () => true,
)

const PAppBar: FC = () => {
  const goBack = usePrivateNote(state => state.goBack)
  const openSetting = usePrivateNote(state => state.openSetting)
  const insets = useSafeAreaInsets()
  const { event } = useContentScroll()

  const appBarTitleStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(event.value.y, [0, HEADER_HEIGHT], [0, 1]),
    }
  }, [])

  const actions = [
    {
      icon: 'settings',
      visible: true,
      onPress: openSetting,
    },
  ]

  return (
    <Appbar
      title="Private notes"
      entering={FadeInUp.duration(200)}
      exiting={FadeOutUp.duration(200)}
      onBackPress={goBack}
      style={[styles.appbar, { paddingTop: insets.top }]}
      titleStyle={appBarTitleStyle}
      actions={actions}
    />
  )
}

const PActionBar: FC = memo(
  () => {
    const insets = useSafeAreaInsets()
    const deleteItems = usePrivateState(state => state.deleteItems)
    const removeFromPrivate = usePrivateState(state => state.removeFromPrivate)
    const isEmpty = usePrivateState(state => state.selecteds.length === 0)
    const [visible, show, hide] = useVisible()

    const actions = [
      {
        icon: 'redo-alt',
        label: 'Remove',
        disable: isEmpty,
        onPress: removeFromPrivate,
      },
      {
        icon: 'trash',
        label: 'Delete',
        disable: isEmpty,
        onPress: show,
      },
    ]

    return (
      <>
        <ActionBar
          actions={actions}
          entering={FadeInDown.duration(200)}
          exiting={FadeOutDown.duration(200)}
          style={{ paddingBottom: insets.bottom }}
        />
        <Dialog
          visible={visible}
          onRequestClose={hide}
          dismissable
          dismissableBackButton
        >
          <Dialog.Title children="Confirm delete" />
          <Dialog.Content>
            <Text
              variant="bodyMedium"
              children="Private notes will not be moved to trash, confirm to permanently delete this note."
            />
            <AnimatedPressable style={styles.dialog_checkbox}>
              <Checkbox.Android status="checked" />
              <Text children="Don't show again" />
            </AnimatedPressable>
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode="contained" children="Delete" onPress={deleteItems} />
            <Button mode="outlined" children="Cancel" onPress={hide} />
          </Dialog.Actions>
        </Dialog>
      </>
    )
  },
  () => true,
)

const MemoNoteItem = memo(createDropableItem(NoteListItem))

const keyExtractor = (item: Note, index: number) => item.id

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

export default memo(PrivateScreenLayout)
