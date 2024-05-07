import { useFocusEffect } from '@react-navigation/native'
import React, { FC, useCallback } from 'react'
import { BackHandler, StyleSheet, View } from 'react-native'
import {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Home } from '~/components/organisms'
import { useHome } from '~/components/organisms/Home/Provider'
import { useSelection } from '~/hooks'
import { Note } from '~/services/database/model'

type Props = {}

export const HomeScreenLayout: FC<Props> = () => {
  const [isInSelect, selecteds, controller] = useSelection(compareNote)
  const notes = useHome(state => state.notes)
  const pinNotes = useHome(state => state.pinNotes)
  const deleteNotes = useHome(state => state.deleteNotes)
  const hideNotes = useHome(state => state.hideNotes)

  const checkAll = useCallback(() => {
    const isAllChecked = selecteds.length === notes.length
    controller.set(isAllChecked ? [] : notes.map(it => it))
  }, [controller, notes, selecteds])

  const handlePin = useCallback(() => {
    pinNotes(...selecteds)
    controller.disable()
  }, [pinNotes, selecteds])

  const handleHide = useCallback(() => {
    hideNotes(...selecteds)
    controller.disable()
  }, [hideNotes, selecteds])

  const handleDelete = useCallback(() => {
    deleteNotes(...selecteds)
    controller.disable()
  }, [deleteNotes, selecteds, controller])

  const enableSelectionMode = useCallback(
    (item: Note) => {
      controller.enable()
      controller.select(item)
    },
    [controller],
  )

  useFocusEffect(() => {
    const handler = () => {
      isInSelect && controller.disable()
      return isInSelect
    }
    const listener = BackHandler.addEventListener('hardwareBackPress', handler)
    return listener.remove
  })

  return (
    <Home.DragingTagProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          {isInSelect ? (
            <Home.SelectionAppbar
              onClosePress={controller.disable}
              onCheckAllPress={checkAll}
              numOfItem={selecteds.length}
              style={styles.header}
              entering={FadeInUp}
              exiting={FadeOutUp}
            />
          ) : (
            <Home.Header
              style={styles.header}
              entering={FadeInUp}
              exiting={FadeOutUp}
            />
          )}

          <Home.TagList contentContainerStyle={styles.taglist_container} />

          <Home.ContentList
            selecteds={selecteds}
            contentContainerStyle={styles.list}
            isInSelect={isInSelect}
            onItemLongPress={enableSelectionMode}
            onItemSelect={controller.select}
          />

          {isInSelect ? (
            <Home.Actionbar
              onPinPress={handlePin}
              onDeletePress={handleDelete}
              onHidePress={handleHide}
              entering={FadeInDown}
              exiting={FadeOutDown}
            />
          ) : (
            <Home.BottomAppbar entering={FadeInDown} exiting={FadeOutDown} />
          )}
        </View>
      </SafeAreaView>
    </Home.DragingTagProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingStart: 16,
    paddingEnd: 4,
    paddingVertical: 4,
  },
  empty: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
  },
  taglist_container: {
    padding: 16,
  },
})

const compareNote = (item1: Note, item2: Note) => item1.id === item2.id
