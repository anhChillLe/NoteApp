import React, { FC, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { FAB } from 'react-native-paper'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { TaskNoteList } from '~/components/molecules'
import { Home, HomeHeaderAction, HomeTagListData } from '~/components/organisms'
import { Note, Task, TaskItem } from '~/services/database/model'

type HomeDataListProps = {
  data: (Note | Task)[]
  onItemPress: (note: Note | Task) => void
  onTaskItemPress: (item: TaskItem) => void
  onNewItem: () => void
}

type Props = HomeHeaderAction & HomeTagListData & HomeDataListProps

export const HomeScreenLayout: FC<Props> = ({
  tags,
  tag,
  data,
  onTagPress,
  onItemPress,
  onTaskItemPress,
  onNewItem,
  onSearchPress,
  onSettingPress,
  onNotificationPress,
  onTagManagerPress: onNewTagPress,
}) => {
  const { bottom } = useSafeAreaInsets()
  const isEmpty = data.length == 0
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.container}>
        <Home.Header
          style={styles.header}
          onNotificationPress={onNotificationPress}
          onSettingPress={onSettingPress}
          onSearchPress={onSearchPress}
        />
        <Home.TagList
          tags={tags}
          tag={tag}
          onTagManagerPress={onNewTagPress}
          contentContainerStyle={[styles.contentContainerStyle]}
          onTagPress={onTagPress}
        />
        {isEmpty ? (
          <Home.Empty onNewItem={onNewItem} style={styles.empty} />
        ) : (
          <>
            <TaskNoteList
              data={data}
              onItemPress={onItemPress}
              onTaskItemPress={onTaskItemPress}
              numColumns={2}
              contentContainerStyle={{ ...styles.list, paddingBottom: bottom }}
            />
            <View style={[styles.fab_container, { bottom: bottom + 32 }]}>
              <FAB size="medium" icon="plus" mode="flat" onPress={onNewItem} />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab_container: {
    position: 'absolute',
    right: 32,
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
  contentContainerStyle: {
    gap: 8,
    padding: 16,
  },
})
