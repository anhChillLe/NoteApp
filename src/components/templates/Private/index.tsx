import { useFocusEffect } from '@react-navigation/native'
import { FC, useCallback, useState } from 'react'
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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { AnimatedPaper } from '~/components/Animated'
import { StackedIconButton } from '~/components/atoms'
import { Menu } from '~/components/atoms/Menu'
import { NoteListItem } from '~/components/molecules'
import { Appbar, NoteListEmpty } from '~/components/organisms'
import { HomeEmpty } from '~/components/organisms/Home/ContentList/Empty'
import { PrivateNote, usePrivateNote } from '~/components/organisms/Private'
import { SelectionAppbar } from '~/components/organisms/SelectionAppbar'
import { Note } from '~/services/database/model'
import { usePrivateSelection } from '~/store/private'

export const PrivateNoteScreenLayout: FC = () => {
  const notes = usePrivateNote(state => state.notes)
  const goBack = usePrivateNote(state => state.goBack)
  const openEditor = usePrivateNote(state => state.openEditor)

  const insets = useSafeAreaInsets()

  const header = useAnimatedRef()

  const { disable, isInSelectMode, select, selecteds, set } =
    usePrivateSelection()

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
        style={{ flex: 1 / 2 }}
        maxLineOfContent={6}
        maxLineOfTitle={1}
        selectable={isInSelectMode}
        isSelected={isSelected}
        onPress={onPress}
        onLongPress={onLongPress}
      />
    )
  }

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
    <View style={styles.container}>
      {isInSelectMode ? (
        <SelectionAppbar
          entering={FadeInUp.duration(200)}
          exiting={FadeOutUp.duration(200)}
          onClosePress={disable}
          onCheckAllPress={() => set(notes.map(it => it))}
          numOfItem={selecteds.length}
          style={{ paddingTop: insets.top }}
        />
      ) : (
        <Appbar
          title="Private notes"
          entering={FadeInUp.duration(200)}
          exiting={FadeOutUp.duration(200)}
          onBackPress={goBack}
          style={{ paddingTop: insets.top }}
          titleStyle={appBarTitleStyle}
          menuContent={<Text>Change Password</Text>}
        />
      )}
      <Animated.FlatList
        data={notes}
        extraData={selecteds}
        style={styles.list}
        numColumns={1}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onScroll={scrollHandler}
        contentContainerStyle={styles.list_content}
        bounces={false}
        ListEmptyComponent={<NoteListEmpty />}
        ListHeaderComponent={
          <Animated.View ref={header} style={[styles.header, headerStyle]}>
            <Text variant="displayMedium">Private notes</Text>
          </Animated.View>
        }
      />
      {isInSelectMode && (
        <PrivateNote.Actionbar
          entering={FadeInDown.duration(200)}
          exiting={FadeOutDown.duration(200)}
          style={{ paddingBottom: insets.bottom }}
        />
      )}
    </View>
  )
}

const keyExtractor = (item: Note, index: number) => item.id

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    alignItems: 'stretch',
  },
  list_content: {
    paddingHorizontal: 16,
    gap: 8,
    flexGrow: 1,
  },
  list: {
    flex: 1,
  },

  header: {
    paddingVertical: 16,
  },
})
