import { MasonryListRenderItem } from '@shopify/flash-list'
import { FC, memo, useMemo } from 'react'
import { StyleSheet, View, useWindowDimensions } from 'react-native'
import { trigger } from 'react-native-haptic-feedback'
import { Button, Checkbox, Text, TextInput } from 'react-native-paper'
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
import { useShallow } from 'zustand/react/shallow'
import {
  AnimatedMasonryNoteList,
  AnimatedPressable,
} from '~/components/Animated'
import {
  ContentScrollProvider,
  useContentScroll,
  useDeletedNote,
} from '~/components/Provider'
import { Dialog, NoteListItem } from '~/components/molecules'
import {
  ActionBar,
  Appbar,
  NoteListEmpty,
  SelectionAppbar,
} from '~/components/organisms'
import { useVisible } from '~/hooks'
import useTrashState from '~/screens/Trash/store'
import { Note } from '~/services/database/model'

const TrashScreenLayout: FC = () => {
  const isInSelectMode = useTrashState(state => state.mode === 'select')

  return (
    <ContentScrollProvider>
      <View style={styles.container}>
        {isInSelectMode ? <TSelectionAppBar /> : <TAppBar />}
        <View style={styles.content}>
          <Header />
          <ContentList />
        </View>

        {isInSelectMode && <TActionBar />}
      </View>
    </ContentScrollProvider>
  )
}

const TAppBar: FC = () => {
  const goBack = useDeletedNote(state => state.goBack)
  const insets = useSafeAreaInsets()
  const { event } = useContentScroll()

  const appBarTitleStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(event.value.y, [0, HEADER_HEIGHT], [0, 1]),
    }
  }, [])

  const actions = [
    {
      title: 'Setting',
    },
  ]

  return (
    <Appbar
      title="Trash"
      entering={FadeInUp.duration(200)}
      exiting={FadeOutUp.duration(200)}
      onBackPress={goBack}
      style={[styles.appbar, { paddingTop: insets.top }]}
      titleStyle={appBarTitleStyle}
      actions={actions}
    />
  )
}

const ContentList: FC = memo(
  () => {
    const notes = useDeletedNote(state => state.notes)
    const openEditor = useDeletedNote(state => state.openEditor)

    const { isInSelectMode, select, selecteds } = useTrashState(
      useShallow(state => ({
        isInSelectMode: state.mode === 'select',
        select: state.select,
        selecteds: state.selecteds,
      })),
    )

    const insets = useSafeAreaInsets()

    const window = useWindowDimensions()
    const numColumns = notes.length === 0 ? 1 : Math.round(window.width / 200)
    const extraData = useMemo(() => ({}), [selecteds, numColumns])

    const { event } = useContentScroll()
    const scrollHandler = useAnimatedScrollHandler(e => {
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
        select(item)
      }

      const isSelected = selecteds.some(it => it.id === item.id)

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
  },
  () => true,
)

const Header: FC = memo(
  () => {
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
        <Text variant="displayMedium">Trash</Text>
      </Animated.View>
    )
  },
  () => true,
)

const keyExtractor = (item: Note, index: number) => item.id

const TSelectionAppBar: FC = memo(
  () => {
    const insets = useSafeAreaInsets()
    const notes = useDeletedNote(state => state.notes)
    const { setMode, selecteds, setSelecteds } = useTrashState()

    const checkAll = () => setSelecteds(notes)
    const close = () => setMode('default')

    return (
      <SelectionAppbar
        entering={FadeInUp.duration(200)}
        exiting={FadeOutUp.duration(200)}
        onClosePress={close}
        onCheckAllPress={checkAll}
        numOfItem={selecteds.length}
        style={{ paddingTop: insets.top }}
      />
    )
  },
  () => true,
)

const TActionBar: FC = memo(
  () => {
    const insets = useSafeAreaInsets()
    const deleteNotes = useTrashState(state => state.deleteNotes)
    const restoreNotes = useTrashState(state => state.restoreNotes)
    const [visible, show, hide] = useVisible()

    const actions = [
      {
        icon: 'redo-alt',
        label: 'Restore',
        onPress: restoreNotes,
      },
      {
        icon: 'trash',
        label: 'CLear',
        onPress: show,
      },
    ]

    const handleDelete = () => {
      deleteNotes()
      trigger('effectTick')
    }

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
              children="Confirm permanent deletion of this notes."
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode="contained" children="Delete" onPress={handleDelete} />
            <Button mode="outlined" children="Cancel" onPress={hide} />
          </Dialog.Actions>
        </Dialog>
      </>
    )
  },
  () => true,
)

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

export default memo(TrashScreenLayout)
