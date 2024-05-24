import { useFocusEffect } from '@react-navigation/native'
import { FC } from 'react'
import { BackHandler, ListRenderItem, StyleSheet, View } from 'react-native'
import { IconButton, Text, useTheme } from 'react-native-paper'
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
  interpolate,
  measure,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AnimatedPaper } from '~/components/Animated'
import { StackedIconButton } from '~/components/atoms'
import { NoteListItem } from '~/components/molecules'
import { Appbar } from '~/components/organisms'
import { DeletedNote, useDeletedNote } from '~/components/organisms/Delete'
import { HomeEmpty } from '~/components/organisms/Home/ContentList/Empty'
import { SelectionAppbar } from '~/components/organisms/SelectionAppbar'
import { Note } from '~/services/database/model'
import { useDeletedSelection } from '~/store/delete'

export const DeletedNoteScreenLayout: FC = () => {
  const notes = useDeletedNote(state => state.notes)
  const goBack = useDeletedNote(state => state.goBack)
  const openEditor = useDeletedNote(state => state.openEditor)
  const restoreItems = useDeletedNote(state => state.restoreItems)
  const deleteItems = useDeletedNote(state => state.deleteItems)

  const { colors } = useTheme()

  const { disable, isInSelectMode, select, selecteds, set } =
    useDeletedSelection()

  const renderItem: ListRenderItem<Note> = ({ item }) => {
    const isSelected = selecteds.some(it => it.id === item.id)

    const onPress = () => {
      if (isInSelectMode) select(item)
      else openEditor(item)
    }

    const onLongPress = () => {
      select(item)
    }

    return (
      <NoteListItem
        data={item}
        maxLineOfContent={6}
        maxLineOfTitle={1}
        selectable={isInSelectMode}
        isSelected={isSelected}
        onPress={onPress}
        onLongPress={onLongPress}
      />
    )
  }

  const header = useAnimatedRef()

  const progress = useSharedValue(0)

  const scrollHandler = useAnimatedScrollHandler(e => {
    const height = measure(header)?.height ?? 0
    const offset = e.contentOffset.y
    progress.value = interpolate(offset, [0, height], [0, 1], 'clamp')
  }, [])

  const headerStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - progress.value,
    }
  }, [])

  const appBarTitleStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
    }
  }, [])

  useFocusEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      isInSelectMode && disable()
      return isInSelectMode
    })
    return listener.remove
  })

  return (
    <SafeAreaView style={styles.container}>
      {isInSelectMode ? (
        <SelectionAppbar
          entering={FadeInUp.duration(200)}
          exiting={FadeOutUp.duration(200)}
          onClosePress={disable}
          onCheckAllPress={() => set(notes.map(it => it))}
          numOfItem={selecteds.length}
        />
      ) : (
        <Appbar
          entering={FadeInUp.duration(200)}
          exiting={FadeOutUp.duration(200)}
          onBackPress={goBack}
          titleStyle={appBarTitleStyle}
          title="Deleted"
          menuContent={<Text>Setting</Text>}
        />
      )}
      <Animated.FlatList
        data={notes}
        extraData={selecteds}
        style={styles.list}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list_content}
        onScroll={scrollHandler}
        bounces={true}
        ListHeaderComponent={
          <Animated.View ref={header} style={[styles.header, headerStyle]}>
            <Text variant="displayMedium">Deleted notes</Text>
          </Animated.View>
        }
        ListEmptyComponent={<HomeEmpty style={{ flex: 1 }} />}
      />
      {isInSelectMode && (
        <DeletedNote.ActionBar
          entering={FadeInDown.duration(200)}
          exiting={FadeOutDown.duration(200)}
        />
      )}
    </SafeAreaView>
  )
}

const keyExtractor = (item: Note, index: number) => item.id

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    alignItems: 'stretch',
  },
  app_bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appbar_title: {
    fontWeight: '600',
  },
  list_content: {
    paddingHorizontal: 16,
    gap: 8,
    flexGrow: 1,
  },
  list: {
    flex: 1,
  },
  action_bar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  header: {
    paddingVertical: 16,
  },
})
