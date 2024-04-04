import { useNavigation } from '@react-navigation/native'
import React, { FC, useCallback, useMemo, useState } from 'react'
import { HomeScreenLayout } from '~/components/templates'
import { useQuery, useRealm } from '~/services/database'
import { Note, Tag, Task, TaskItem } from '~/services/database/model'
import { queryByTag } from '~/services/database/query'

export const HomeScreen: FC = () => {
  const navigation = useNavigation()
  const realm = useRealm()

  const [currentTag, setCurrentTag] = useState<Tag>()

  const tags = useQuery(Tag, tags => tags.filtered('isPinned==true'))

  const notes = useQuery(Note, notes => queryByTag(notes, currentTag), [
    currentTag,
  ])
  const tasks = useQuery(Task, tasks => queryByTag(tasks, currentTag), [
    currentTag,
  ])

  const data = useMemo(() => {
    return [...notes, ...tasks]
  }, [notes, tasks])

  const handleTaskItemPress = useCallback(
    (item: TaskItem) => {
      realm.write(() => {
        item.changeStatus()
      })
    },
    [realm],
  )

  const handleItemPress = useCallback(
    (item: Task | Note) => {
      if (item instanceof Note) {
        navigation.navigate('note_edit', { id: item.id })
      } else {
        navigation.navigate('task_edit', { id: item.id })
      }
    },
    [navigation],
  )

  const handleNewTag = useCallback(() => {
    navigation.navigate('tag_manager')
  }, [navigation])

  const handleNewItem = useCallback(() => {
    navigation.navigate('task_edit')
  }, [navigation])

  const handleSettingPress = useCallback(() => {
    realm.write(() => {
      realm.deleteAll()
    })
  }, [])

  const handleSearchPress = useCallback(() => {}, [])

  const handleNotificationPress = useCallback(() => {}, [])

  return (
    <HomeScreenLayout
      tags={tags.map(it => it)}
      tag={currentTag}
      data={data}
      onTagManagerPress={handleNewTag}
      onTagPress={setCurrentTag}
      onTaskItemPress={handleTaskItemPress}
      onItemPress={handleItemPress}
      onNewItem={handleNewItem}
      onSettingPress={handleSettingPress}
      onNotificationPress={handleNotificationPress}
      onSearchPress={handleSearchPress}
    />
  )
}
