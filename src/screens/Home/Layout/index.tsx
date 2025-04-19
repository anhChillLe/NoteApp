import { TriggerNotification } from '@notifee/react-native'
import { MasonryListRenderItem } from '@shopify/flash-list'
import { Note, Tag, TaskItem } from 'note-app-database'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ScrollViewProps,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native'
import {
  Actionbar,
  BottomAppbar,
  Button,
  createDropableItem,
  Dialog,
  DragProvider,
  Text,
  useDrag,
  useToast,
} from 'react-native-chill-ui'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  cancelAnimation,
  Easing,
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
  LinearTransition,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useReminder } from '~/app/providers/notification'
import {
  AnimatedMasonryNoteList,
  NoteListEmpty,
  NoteListItem,
  SelectionAppbar,
  TagList,
} from '~/components'
import { useLayout, useVisible } from '~/hooks'
import { useSetting } from '~/app/providers/settings'
import { Haptick } from '~/services/haptick'
import { HomeMode, useHome } from '../Provider'
import Activable from './Activable'
import HomeHeader from './HomeHeader'

const HomeScreenLayout: FC = () => {
  const { mode } = useHome()

  return (
    <DragProvider>
      <View style={styles.container}>
        {mode === 'select' ? <HSelectionAppbar /> : <HHeader />}
        <HTagList />
        <HContent />
        {mode === 'select' && <HActionBar />}
        {mode === 'default' && <HBottomAppBar />}
      </View>
    </DragProvider>
  )
}

const HTagList: FC = () => {
  const {
    tags,
    currentTagId,
    setCurrentTagId,
    openTagManager,
    openDeletedNote,
  } = useHome()

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
}

const DropableNoteItem = createDropableItem(NoteListItem)
interface ExtraData {
  isInSelectMode: boolean
  selecteds: Set<string> | 'all'
  extras: Tag | null
  notifications: TriggerNotification[]
  select: (item: Note) => void
  setMode: (mode: HomeMode) => void
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
    setMode,
    select,
    openEditor,
    addTagToNote,
    changeTaskItemStatus,
    notifications,
  } = extraData as ExtraData

  const onPress = () => {
    if (isInSelectMode) {
      select(item)
      Haptick.light()
    } else openEditor(item)
  }

  const onLongPress = () => {
    Haptick.medium()
    select(item)
    setMode('select')
  }

  const submitDrop = () => {
    if (extras) {
      addTagToNote(item, extras)
      Haptick.medium()
    }
  }

  const isSelected = selecteds === 'all' || selecteds.has(item.id)

  const notification = notifications.find(it => it.notification.id === item.id)

  return (
    <DropableNoteItem
      data={item}
      isSelected={isSelected}
      selectable={isInSelectMode}
      style={styles.list_item}
      maxLineOfContent={6}
      maxLineOfTitle={1}
      notification={notification}
      onPress={onPress}
      onLongPress={onLongPress}
      onTaskItemPress={changeTaskItemStatus}
      onDropIn={submitDrop}
      onDragIn={Haptick.light}
    />
  )
}

const DropableNoteListEmpty = createDropableItem(NoteListEmpty)
const NoteList: FC<ScrollViewProps> = props => {
  const {
    notes,
    mode,
    selecteds,
    openEditor,
    openNewNoteEditor,
    changeTaskItemStatus,
    addTagToNote,
    select,
    setMode,
  } = useHome()

  const { extras } = useDrag<Tag>()
  const { notifications } = useReminder()
  const { numOfColumns } = useSetting()
  const windowDimension = useWindowDimensions()
  const numColumns = numOfColumns ?? Math.round(windowDimension.width / 200)

  const isInSelectMode = mode === 'select'

  const extraData: ExtraData = {
    isInSelectMode,
    selecteds,
    notifications,
    extras,
    setMode,
    select,
    openEditor,
    addTagToNote,
    changeTaskItemStatus,
  }

  if (notes.isEmpty()) {
    return (
      <Animated.ScrollView
        contentContainerStyle={styles.list_empty_content}
        {...props}
      >
        <DropableNoteListEmpty
          onDropIn={() => {
            if (extras) {
              openNewNoteEditor(extras.id)
              Haptick.light()
            }
          }}
        />
      </Animated.ScrollView>
    )
  }

  return (
    <AnimatedMasonryNoteList
      data={notes}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      extraData={extraData}
      numColumns={numColumns}
      bounces={false}
      contentContainerStyle={styles.list_content}
      estimatedItemSize={200}
      {...props}
    />
  )
}

// Android Scrollview not support bounces
const HContent: FC = () => {
  const { t } = useTranslation()
  const { openPrivateNote } = useHome()
  const [layout, onLayout] = useLayout()
  const height = layout?.height ?? 0

  const scrollY = useSharedValue(0)
  const initY = useSharedValue(0)
  const gesture = Gesture.Pan()
    .manualActivation(true)
    .onBegin(e => {
      initY.value = e.y
    })
    .onTouchesMove((e, state) => {
      if (e.changedTouches[0].y >= initY.value && scrollY.value <= 0) {
        state.activate()
      } else {
        state.fail()
      }
    })
    .onStart(() => {
      cancelAnimation(scrollY)
    })
    .onUpdate(e => {
      scrollY.value = -e.translationY * 0.5
    })
    .onEnd(() => {
      if (scrollY.value <= -0.25 * height) {
        runOnJS(openPrivateNote)()
      }
    })
    .onFinalize(() => {
      if (scrollY.value < 0) {
        scrollY.value = withTiming(0, {
          duration: 200,
          easing: Easing.out(Easing.cubic),
        })
      }
    })

  const scrollHandler = useAnimatedScrollHandler(e => {
    scrollY.value = e.contentOffset.y
  }, [])

  const listStyle = useAnimatedStyle(() => {
    const translateY = -scrollY.value <= 0 ? 0 : -scrollY.value
    return { transform: [{ translateY }] }
  }, [])

  return (
    <Animated.View style={styles.content_container}>
      <Activable
        icon="lock-closed-outline"
        title={t('open_private')}
        offset={scrollY}
        activeRange={[0.1 * height, 0.25 * height]}
      />
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.list, listStyle]}>
          <NoteList
            onLayout={onLayout}
            onScroll={scrollHandler}
            overScrollMode="never"
          />
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  )
}

const HHeader: FC = () => {
  const { top } = useSafeAreaInsets()

  const {
    openTagManager,
    openSetting,
    mode,
    searchValue,
    setSearchValue,
    setMode,
  } = useHome()

  const isActiveSearch = mode === 'search'

  const handleSearchPress = () => {
    setMode('search')
    Haptick.light()
  }

  const handleCancelSearchPress = () => {
    setMode('default')
    Haptick.light()
  }

  return (
    <HomeHeader
      style={[styles.header, { paddingTop: top }]}
      entering={FadeInUp}
      exiting={FadeOutUp}
      isActiveSearch={isActiveSearch}
      searchValue={searchValue}
      onSearchValueChange={setSearchValue}
      onSearchPress={handleSearchPress}
      onCancelSearchPress={handleCancelSearchPress}
      onManagePress={openTagManager}
      onSettingPress={openSetting}
    />
  )
}

const HBottomAppBar: FC = () => {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()
  const { currentTagId, openNewNoteEditor, openNewTaskEditor } = useHome()

  const handleNewNotePress = () => {
    openNewNoteEditor(currentTagId)
    Haptick.light()
  }

  const handleNewTaskPress = () => {
    openNewTaskEditor(currentTagId)
    Haptick.light()
  }

  return (
    <BottomAppbar
      entering={FadeInDown}
      exiting={FadeOutDown}
      style={{ paddingBottom: bottom + 8 }}
    >
      <BottomAppbar.Action
        icon="add-outline"
        size="xlarge"
        mode="contained"
        accessibilityLabel={t('add_new_note')}
        onPress={handleNewNotePress}
      />
      <BottomAppbar.Action
        icon="checkbox-outline"
        size="medium"
        accessibilityLabel={t('add_new_task')}
        onPress={handleNewTaskPress}
      />
    </BottomAppbar>
  )
}

const HSelectionAppbar: FC = () => {
  const { top } = useSafeAreaInsets()
  const { setMode, selectAll, selecteds, notes } = useHome()

  const handleCheckAllPress = () => {
    selectAll()
  }

  const handleClosePress = () => {
    setMode('default')
  }

  const numOfItem = (() => {
    if (selecteds === 'all') {
      return notes.length
    } else {
      return selecteds.size
    }
  })()

  return (
    <SelectionAppbar
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={[styles.header, { paddingTop: top + 4 }]}
      numOfItem={numOfItem}
      onCheckAllPress={handleCheckAllPress}
      onClosePress={handleClosePress}
    />
  )
}

const HActionBar: FC = () => {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()
  const toast = useToast()

  const {
    selecteds,
    isAllPinned,
    pinNotes,
    unPinNotes,
    deleteNotes,
    privateNotes,
    openReminder,
    setMode,
  } = useHome()

  const isEmpty = selecteds !== 'all' && selecteds.size === 0
  const isSingle = selecteds !== 'all' && selecteds.size === 1

  const [dialogVisible, showDialog, hideDialog] = useVisible()

  const handleDeleteDialogPress = () => {
    Haptick.light()
    hideDialog()
    deleteNotes()
    setMode('default')
  }

  const handlePinPress = () => {
    Haptick.light()
    pinNotes()
    setMode('default')
  }

  const handleUnPinPress = () => {
    Haptick.light()
    unPinNotes()
    setMode('default')
  }

  const handleHidePress = () => {
    Haptick.light()
    privateNotes()
    setMode('default')
    toast.show({
      text: t('home_hided_toast_message'),
      duration: 2500,
    })
  }

  const handleReminderPress = () => {
    Haptick.light()
    openReminder()
    setMode('default')
  }

  return (
    <>
      <Actionbar
        style={{ paddingBottom: bottom }}
        itemLayout={LinearTransition}
        entering={FadeInDown}
        exiting={FadeOutDown}
      >
        {isAllPinned ? (
          <Actionbar.Action
            icon="bookmark-outline"
            title={t('unPin')}
            onPress={handleUnPinPress}
            disabled={isEmpty}
          />
        ) : (
          <Actionbar.Action
            icon="bookmark-outline"
            title={t('pin')}
            onPress={handlePinPress}
            disabled={isEmpty}
          />
        )}
        <Actionbar.Action
          icon="trash-outline"
          title={t('delete')}
          onPress={showDialog}
          disabled={isEmpty}
        />
        <Actionbar.Action
          icon="lock-closed-outline"
          title={t('hide')}
          onPress={handleHidePress}
          disabled={isEmpty}
        />
        {isSingle && (
          <Actionbar.Action
            icon="notifications-outline"
            title={t('remind')}
            onPress={handleReminderPress}
          />
        )}
      </Actionbar>
      <Dialog
        visible={dialogVisible}
        dismissable
        dismissableBackButton
        onRequestClose={hideDialog}
      >
        <Dialog.Title children={t('confirm_delete')} />
        <Dialog.Content>
          <Text
            variant="bodyMedium"
            children={t('home_confirm_delete_description')}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            mode="contained"
            onPress={handleDeleteDialogPress}
            title={t('delete')}
          />
          <Button mode="outlined" onPress={hideDialog} title={t('cancel')} />
        </Dialog.Actions>
      </Dialog>
    </>
  )
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
  list: {
    flex: 1,
  },
  list_content: {
    paddingHorizontal: 12,
  },
  list_empty_content: {
    flexGrow: 1,
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

export default HomeScreenLayout
