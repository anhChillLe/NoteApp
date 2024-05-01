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
import { OrderedCollection } from 'realm'
import { Home, HomeHeaderAction, HomeTagListData } from '~/components/organisms'
import { HomeProvider } from '~/components/organisms/Home/Provider'
import { useSelection } from '~/hooks'
import { Note, Tag, TaskItem } from '~/services/database/model'

type HomeDataListProps = {
  data: Note[] | OrderedCollection<Note>
  onItemPress: (item: Note) => void
  onTaskItemPress: (item: TaskItem) => void
  onNewTask: () => void
  onNewNote: () => void
  onPin: (...items: Note[]) => void
  onDelete: (...items: Note[]) => void
  onAddTagToItem: (tag: Tag, item: Note) => void
}

type Props = HomeHeaderAction & HomeTagListData & HomeDataListProps

const compareItem = (item1: Note, item2: Note) => item1.id === item2.id

export const HomeScreenLayout: FC<Props> = ({
  tags,
  tag,
  data,
  onTagPress,
  onItemPress,
  onTaskItemPress,
  onNewTask,
  onNewNote,
  onSearchPress,
  onSettingPress,
  onFolderPress,
  onTagManagerPress,
  onAddTagToItem,
  onPin,
  onDelete,
}) => {
  const [isInSelect, selecteds, controller] = useSelection(compareItem)

  const handleCheckAll = useCallback(() => {
    const isAllChecked = selecteds.length === data.length
    controller.set(isAllChecked ? [] : data.map(it => it))
  }, [controller, data, selecteds])

  const handlePin = useCallback(() => {
    onPin(...selecteds)
  }, [onPin, selecteds])

  const handleDelete = useCallback(() => {
    onDelete(...selecteds)
    controller.disable()
  }, [onDelete, selecteds, controller])

  const handleItemLongPress = useCallback(
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
    <HomeProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          {isInSelect ? (
            <Home.SelectionAppbar
              onClosePress={controller.disable}
              onCheckAllPress={handleCheckAll}
              numOfItem={selecteds.length}
              entering={FadeInUp}
              exiting={FadeOutUp}
              style={styles.header}
            />
          ) : (
            <Home.Header
              style={styles.header}
              entering={FadeInUp}
              exiting={FadeOutUp}
              onFolderPress={onFolderPress}
              onSettingPress={onSettingPress}
              onSearchPress={onSearchPress}
            />
          )}

          <Home.TagList
            tags={tags}
            tag={tag}
            style={styles.tags}
            onTagManagerPress={onTagManagerPress}
            contentContainerStyle={[styles.taglist_container]}
            onTagPress={onTagPress}
          />

          <Home.ContentList
            data={data}
            selecteds={selecteds}
            contentContainerStyle={styles.list}
            isInSelect={isInSelect}
            onItemPress={onItemPress}
            onItemLongPress={handleItemLongPress}
            onItemSelect={controller.select}
            onTaskItemPress={onTaskItemPress}
            onTagToItem={onAddTagToItem}
          />

          {isInSelect ? (
            <Home.Actionbar
              entering={FadeInDown}
              exiting={FadeOutDown}
              onPinPress={handlePin}
              onDeletePress={handleDelete}
            />
          ) : (
            <Home.BottomAppbar
              entering={FadeInDown}
              exiting={FadeOutDown}
              onNewNotePress={onNewNote}
              onNewTaskPress={onNewTask}
            />
          )}
        </View>
      </SafeAreaView>
    </HomeProvider>
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
  tags: {
    zIndex: 1,
  },
  taglist_container: {
    padding: 16,
  },
})
