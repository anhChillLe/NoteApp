import { MasonryListRenderItem } from '@shopify/flash-list'
import React, { FC, memo, useEffect, useMemo, useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollViewProps,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { trigger } from 'react-native-haptic-feedback'
import Animated, {
  cancelAnimation,
  Easing,
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
  LayoutAnimationConfig,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  WithTimingConfig,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'
import useAppState from '~/app/store'
import { AnimatedMasonryNoteList } from '~/components/Animated'
import { NoteListItem, Toast } from '~/components/molecules'
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
import { useLayout, useVisible } from '~/hooks'
import useHomeState from '~/screens/Home/store'
import useSetting from '~/screens/Setting/store'
import { Note, Tag } from '~/services/database/model'

const HomeScreenLayout: FC = () => {
  const mode = useHomeState(state => state.mode)

  return (
    <DragProvider>
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
        <HToastPrivate />
        <HToastDelete />
      </LayoutAnimationConfig>
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

const NoteList: FC<Partial<ScrollViewProps>> = props => {
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

  const extraData = useMemo(() => ({}), [selecteds, extras])

  if (notes.isEmpty()) {
    return (
      <Animated.ScrollView contentContainerStyle={{ flexGrow: 1 }} {...props}>
        <NoteListEmpty />
      </Animated.ScrollView>
    )
  }

  const renderItem: MasonryListRenderItem<Note> = ({ item, columnIndex }) => {
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

  const keyExtractor = (item: Note, index: number) => item?.id ?? index

  return (
    <AnimatedMasonryNoteList
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
}

// Android Scrollview not support bounces
const HomeContentAndroid: FC = () => {
  const [activePan, setActivePan] = useState(true)
  const openPrivateNote = useHome(state => state.openPrivateNote)
  const [layout, onLayout] = useLayout()
  const height = layout?.height ?? 0

  const scrollY = useSharedValue(0)

  const handler = useAnimatedScrollHandler(
    {
      onScroll: event => {
        const offsetY = event.contentOffset.y
        scrollY.value = offsetY
        runOnJS(setActivePan)(offsetY <= 0)
      },
    },
    [setActivePan],
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
          <NoteList
            onScroll={handler}
            onLayout={onLayout}
            overScrollMode="never"
          />
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  )
}

const HomeContentIOS: FC = () => {
  const openPrivateNote = useHome(state => state.openPrivateNote)
  const scrollY = useSharedValue(0)

  const [layout, onLayout] = useLayout()
  const height = layout?.height ?? 0

  const handler = useAnimatedScrollHandler(
    {
      onScroll: event => {
        scrollY.value = event.contentOffset.y
      },
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
        activeRange={[50, 150]}
      />
      <NoteList onLayout={onLayout} onScroll={handler} />
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
        onPress: openNewNoteEditor,
      },
      {
        icon: 'checkbox',
        onPress: openNewTaskEditor,
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
    const isClonable = useHomeState(state => state.selecteds.length <= 10)

    const pinNotes = useHomeState(state => state.pinNotes)
    const deleteNotes = useHomeState(state => state.deleteNotes)
    const privateNotes = useHomeState(state => state.privateNotes)
    const cloneNotes = useHomeState(state => state.cloneNotes)

    const setFirstPrivate = useAppState(state => state.setFirstPrivate)
    const setFirstDelete = useAppState(state => state.setFirstDelete)

    const [visible, show, hide] = useVisible()

    if (__DEV__) {
      useEffect(() => {
        setFirstPrivate(true)
        setFirstDelete(true)
      }, [setFirstPrivate])
    }

    const actions = [
      { icon: 'thumbtack', label: 'Pin', onPress: pinNotes, disable: isEmpty },
      {
        icon: 'trash',
        label: 'Delete',
        onPress: () => {
          deleteNotes()
          setFirstDelete(false)
        },
        disable: isEmpty,
      },
      {
        icon: 'lock',
        label: 'Private',
        onPress: () => {
          privateNotes()
          setFirstPrivate(false)
        },
        disable: isEmpty,
      },
      {
        icon: 'copy',
        label: 'Clone',
        onPress: isClonable ? cloneNotes : show,
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
        <Toast
          visible={visible}
          onDismiss={hide}
          children="Can't clone more than 10 items"
          gravity={128}
          duration={1200}
        />
      </>
    )
  },
  () => true,
)

const HToastPrivate = memo(
  () => {
    const [visible, show, hide] = useVisible()

    useEffect(() => {
      const unsub = useAppState.subscribe((state, prevState) => {
        if (!state.isFirstPrivate && prevState.isFirstPrivate) {
          show()
        }
      })
      return unsub
    }, [show])

    return (
      <Toast
        visible={visible}
        children="Notes was moved to private, pull down list to show private notes."
        gravity={128}
        onDismiss={hide}
      />
    )
  },
  () => true,
)

const HToastDelete = memo(
  () => {
    const [visible, show, hide] = useVisible()

    useEffect(() => {
      const unsub = useAppState.subscribe((state, prevState) => {
        if (!state.isFirstDelete && prevState.isFirstDelete) {
          show()
        }
      })
      return unsub
    }, [show])

    return (
      <Toast
        visible={visible}
        children="Notes was moved to trash, it will be deleted affter 60 days."
        gravity={128}
        onDismiss={hide}
      />
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
})

export default memo(HomeScreenLayout)
