import { MasonryListRenderItem } from '@shopify/flash-list'
import React, {
  FC,
  forwardRef,
  memo,
  useCallback,
  useMemo,
  useState,
} from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { trigger } from 'react-native-haptic-feedback'
import { Button, Text } from 'react-native-paper'
import Animated, {
  cancelAnimation,
  Easing,
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
  LayoutAnimationConfig,
  runOnJS,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useScrollViewOffset,
  withTiming,
  WithTimingConfig,
} from 'react-native-reanimated'
import { AnimatedScrollView } from 'react-native-reanimated/lib/typescript/reanimated2/component/ScrollView'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { OrderedCollection } from 'realm'
import { useShallow } from 'zustand/react/shallow'
import { AnimatedMasonryNoteList } from '~/components/Animated'
import { Dialog, NoteListItem, Toast } from '~/components/molecules'
import {
  ActionBar,
  Activable,
  BottomAppbar,
  HomeHeader,
  NoteListEmpty,
  SelectionAppbar,
  TagList,
} from '~/components/organisms'
import {
  createDropableItem,
  DragProvider,
  useDrag,
  useHome,
} from '~/components/Provider'
import ToastProvider, { useToast } from '~/components/Provider/ToastProvider'
import { useLayout, useVisible } from '~/hooks'
import useHomeState from '~/screens/Home/store'
import useSetting from '~/screens/Setting/store'
import { Note, Tag, TaskItem } from '~/services/database/model'

const HomeScreenLayout: FC = () => {
  const mode = useHomeState(state => state.mode)

  return (
    <DragProvider>
      <ToastProvider>
        <LayoutAnimationConfig skipEntering>
          <View style={styles.container}>
            {mode === 'select' ? <HSelectionAppbar /> : <HHeader />}

            <KeyboardAvoidingView
              style={styles.container}
              behavior="padding"
              keyboardVerticalOffset={8}
            >
              <View style={styles.container}>
                <HTagList />
                <HContent />
              </View>
            </KeyboardAvoidingView>

            {mode !== 'search' &&
              (mode === 'select' ? <HActionBar /> : <HBottomAppBar />)}
          </View>
        </LayoutAnimationConfig>
      </ToastProvider>
    </DragProvider>
  )
}

const HTagList = memo(
  () => {
    const tags = useHome(state => state.tags)
    const currentTagId = useHomeState(state => state.currentTagId)
    const setCurrentTagId = useHomeState(state => state.setCurrentTagId)
    const openTagManager = useHome(state => state.openTagManager)
    const openDeletedNote = useHome(state => state.openDeletedNote)

    return (
      <TagList
        data={tags}
        currentTagId={currentTagId}
        onTagChange={setCurrentTagId}
        style={styles.taglist_container}
        onTrashPress={openDeletedNote}
        onManagePress={openTagManager}
        dragable={true}
        limit={6}
      />
    )
  },
  () => true,
)

const MemoNoteItem = memo(createDropableItem(NoteListItem))
interface ExtraData {
  isInSelectMode: boolean
  selecteds: Note[] | OrderedCollection<Note>
  extras: Tag
  select: (item: Note) => void
  openEditor: (item: Note) => void
  addTagToNote: (note: Note, tag: Tag) => void
  changeTaskItemStatus: (item: TaskItem) => void
}
const keyExtractor = (item: Note, index: number) => item?.id ?? index
const renderItem: MasonryListRenderItem<Note> = ({ item, extraData }) => {
  const {
    isInSelectMode,
    selecteds,
    extras,
    select,
    openEditor,
    addTagToNote,
    changeTaskItemStatus,
  } = extraData as ExtraData

  const onPress = () => {
    if (isInSelectMode) select(item)
    else openEditor(item)
  }

  const onLongPress = () => {
    trigger('effectTick')
    select(item)
  }

  const submitDrop = () => {
    if (extras) {
      addTagToNote(item, extras)
      trigger('effectTick')
    }
  }

  const isSelected = selecteds.some(it => it.id === item.id)

  return (
    <MemoNoteItem
      data={item}
      isSelected={isSelected}
      selectable={isInSelectMode}
      style={styles.list_item}
      maxLineOfContent={6}
      maxLineOfTitle={1}
      onPress={onPress}
      onLongPress={onLongPress}
      onTaskItemPress={changeTaskItemStatus}
      onDropIn={submitDrop}
    />
  )
}
const NoteList = forwardRef<ScrollView, ScrollViewProps>((props, ref) => {
  const notes = useHome(state => state.notes)
  const openEditor = useHome(state => state.openEditor)
  const changeTaskItemStatus = useHomeState(state => state.changeTaskItemStatus)
  const addTagToNote = useHomeState(state => state.addTagToNote)
  const isInSelectMode = useHomeState(state => state.mode === 'select')
  const selecteds = useHomeState(state => state.selecteds)
  const select = useHomeState(state => state.select)
  const { extras } = useDrag<Tag>()
  const numOfColumns = useSetting(state => state.numOfColumns)
  const window = useWindowDimensions()
  const numColumns =
    numOfColumns === 'auto' ? Math.round(window.width / 200) : numOfColumns

  const extraData = useMemo(
    () => ({
      isInSelectMode,
      selecteds,
      extras,
      select,
      openEditor,
      addTagToNote,
      changeTaskItemStatus,
    }),
    [
      isInSelectMode,
      selecteds,
      extras,
      select,
      openEditor,
      addTagToNote,
      changeTaskItemStatus,
    ],
  )

  if (notes.isEmpty()) {
    return (
      <Animated.ScrollView
        ref={ref as never}
        contentContainerStyle={{ flexGrow: 1 }}
        {...props}
      >
        <NoteListEmpty />
      </Animated.ScrollView>
    )
  }

  return (
    <AnimatedMasonryNoteList
      ref={ref as never}
      data={notes}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      extraData={extraData}
      numColumns={numColumns}
      contentContainerStyle={styles.list_content}
      estimatedItemSize={200}
      {...props}
    />
  )
})

// Android Scrollview not support bounces
const HomeContentAndroid: FC = () => {
  const [activePan, setActivePan] = useState(true)
  const openPrivateNote = useHome(state => state.openPrivateNote)
  const [layout, onLayout] = useLayout()
  const height = layout?.height ?? 0

  const ref = useAnimatedRef<AnimatedScrollView>()
  const scrollY = useScrollViewOffset(ref)

  useAnimatedReaction(
    () => scrollY.value <= 0,
    value => runOnJS(setActivePan)(value),
    [],
  )
  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(activePan)
        .activeOffsetY(0)
        .onStart(e => cancelAnimation(scrollY))
        .onUpdate(e => {
          scrollY.value = -e.translationY * 0.5
        })
        .onEnd(e => {
          if (scrollY.value <= -0.25 * height) {
            runOnJS(openPrivateNote)()
          }
        })
        .onFinalize(() => {
          scrollY.value = withTiming(0, timingConfig)
        }),
    [activePan, openPrivateNote, height],
  )

  const listStyle = useAnimatedStyle(() => {
    const translateY = -scrollY.value <= 0 ? 0 : -scrollY.value
    return { transform: [{ translateY }] }
  }, [])

  return (
    <Animated.View style={styles.content_container}>
      <Activable
        icon="lock"
        title="Open private"
        offset={scrollY}
        activeRange={[0.1 * height, 0.25 * height]}
      />
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.list, listStyle]}>
          <NoteList ref={ref} onLayout={onLayout} overScrollMode="never" />
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  )
}

const HomeContentIOS: FC = () => {
  const openPrivateNote = useHome(state => state.openPrivateNote)
  const [layout, onLayout] = useLayout()
  const height = layout?.height ?? 0

  const ref = useAnimatedRef<AnimatedScrollView>()
  const scrollY = useScrollViewOffset(ref)

  const handler = useAnimatedScrollHandler(
    {
      onEndDrag: event => {
        if (event.contentOffset.y <= -0.25 * height) {
          runOnJS(openPrivateNote)()
        }
      },
    },
    [openPrivateNote, height],
  )

  return (
    <Animated.View style={styles.content_container}>
      <Activable
        icon="lock"
        title="Open private"
        offset={scrollY}
        activeRange={[0.1 * height, 0.25 * height]}
      />
      <NoteList ref={ref} onLayout={onLayout} onScroll={handler} />
    </Animated.View>
  )
}

const HContent = Platform.select({
  ios: memo(HomeContentIOS, () => true),
  default: memo(HomeContentAndroid, () => true),
})

const HHeader = memo(
  () => {
    const { top } = useSafeAreaInsets()

    const openTagManager = useHome(state => state.openTagManager)
    const openSetting = useHome(state => state.openSetting)

    const {
      isActiveSearch,
      activeSearch,
      disableSearch,
      searchValue,
      setSearchValue,
    } = useHomeState(
      useShallow(state => ({
        isActiveSearch: state.mode === 'search',
        searchValue: state.searchValue,
        setSearchValue: state.setSearchValue,
        activeSearch: () => state.setMode('search'),
        disableSearch: () => state.setMode('default'),
      })),
    )

    return (
      <HomeHeader
        style={[styles.header, { paddingTop: top + 8 }]}
        entering={FadeInUp}
        exiting={FadeOutUp}
        isActiveSearch={isActiveSearch}
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        onSearchPress={activeSearch}
        onCancelSearchPress={disableSearch}
        onManagePress={openTagManager}
        onSettingPress={openSetting}
      />
    )
  },
  () => true,
)

const HBottomAppBar = memo(
  () => {
    const { bottom } = useSafeAreaInsets()
    const openNewNoteEditor = useHome(state => state.openNewNoteEditor)
    const openNewTaskEditor = useHome(state => state.openNewTaskEditor)

    const actions = [
      {
        icon: 'plus-small',
        primary: true,
        onPress: () => {
          openNewNoteEditor()
          trigger('effectTick')
        },
      },
      {
        icon: 'checkbox',
        onPress: () => {
          openNewTaskEditor()
          trigger('effectTick')
        },
      },
    ]

    return (
      <BottomAppbar
        actions={actions}
        entering={FadeInDown}
        exiting={FadeOutDown}
        style={{ paddingBottom: bottom }}
      />
    )
  },
  () => true,
)

const HSelectionAppbar = memo(
  () => {
    const { top } = useSafeAreaInsets()
    const setMode = useHomeState(state => state.setMode)
    const selecteds = useHomeState(state => state.selecteds)
    const setSelecteds = useHomeState(state => state.setSelecteds)
    const notes = useHome(state => state.notes)

    const checkAll = () => setSelecteds(notes)
    const close = () => setMode('default')

    return (
      <SelectionAppbar
        entering={FadeInUp}
        exiting={FadeOutUp}
        style={[styles.header, { paddingTop: top + 8 }]}
        numOfItem={selecteds.length}
        onCheckAllPress={checkAll}
        onClosePress={close}
      />
    )
  },
  () => true,
)

const HActionBar = memo(
  () => {
    const { bottom } = useSafeAreaInsets()

    const isEmpty = useHomeState(state => state.selecteds.length === 0)

    const pinNotes = useHomeState(state => state.pinNotes)
    const deleteNotes = useHomeState(state => state.deleteNotes)
    const privateNotes = useHomeState(state => state.privateNotes)

    const toast = useToast()
    const [dialogVisible, showDialog, hideDialog] = useVisible()

    const handleDelete = () => {
      deleteNotes()
      trigger('effectTick')
    }

    const actions = [
      { icon: 'thumbtack', label: 'Pin', onPress: pinNotes, disable: isEmpty },
      {
        icon: 'trash',
        label: 'Delete',
        onPress: () => {
          showDialog()
        },
        disable: isEmpty,
      },
      {
        icon: 'lock',
        label: 'Private',
        onPress: () => {
          privateNotes()
          toast.show({
            text: 'Notes has been hided. Pull down and hold to active private space.',
            duration: 2500,
          })
        },
        disable: isEmpty,
      },
    ]

    return (
      <>
        <ActionBar
          actions={actions}
          entering={FadeInDown}
          exiting={FadeOutDown}
          style={{ paddingBottom: bottom }}
        />
        <Dialog visible={dialogVisible} onRequestClose={hideDialog}>
          <Dialog.Title children="Confirm delete" />
          <Dialog.Content>
            <Text
              variant="bodyMedium"
              children="Confirm deletion of this notes."
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode="contained" children="Delete" onPress={handleDelete} />
            <Button mode="outlined" children="Cancel" onPress={hideDialog} />
          </Dialog.Actions>
        </Dialog>
      </>
    )
  },
  () => true,
)

const timingConfig: WithTimingConfig = {
  duration: 200,
  easing: Easing.out(Easing.cubic),
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  empty: {
    flex: 1,
  },
  content_container: {
    flex: 1,
    overflow: 'hidden',
  },
  list_empty: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
  },
  list_content: {
    paddingHorizontal: 12,
  },
  list_item: {
    margin: 4,
  },
  taglist_container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  dialog_checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
})

export default memo(HomeScreenLayout)
