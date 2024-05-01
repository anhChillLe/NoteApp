import { useNavigation } from '@react-navigation/native'
import React, { FC, useCallback, useState } from 'react'
import { SortDescriptor } from 'realm'
import { HomeScreenLayout } from '~/components/templates'
import { useQuery, useRealm } from '~/services/database'
import { Note, Tag, TaskItem } from '~/services/database/model'

export const HomeScreen: FC = () => {
  const navigation = useNavigation()
  const realm = useRealm()

  const [currentTag, setCurrentTag] = useState<Tag>()

  const tags = useQuery(Tag, tags => {
    return tags.sorted('isPinned', true)
  })

  const data = useQuery(Note, createNoteQuery(currentTag), [currentTag])

  const handleTaskItemPress = useCallback(
    (item: TaskItem) => {
      realm.write(() => {
        item.changeStatus()
      })
    },
    [realm],
  )

  const handleItemPress = useCallback(
    (item: Note) => {
      if (item.type === 'note') {
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

  const handleNewTask = useCallback(() => {
    navigation.navigate('task_edit')
  }, [navigation])

  const handleNewNote = useCallback(() => {
    navigation.navigate('note_edit')
  }, [navigation])

  const handleSettingPress = useCallback(() => {}, [])

  const handleSearchPress = useCallback(() => {}, [])

  const handlePin = useCallback((...items: Note[]) => {
    realm.write(() => {
      items.forEach(item => {
        item.isPinned = !item.isPinned
      })
    })
  }, [])

  const handleDelete = useCallback((...items: Note[]) => {
    realm.write(() => {
      realm.delete(items)
    })
  }, [])

  const handleAddTag = useCallback((tag: Tag, item: Note) => {
    realm.write(() => {
      if (item.tags.includes(tag)) return
      item.tags.push(tag)
    })
  }, [])

  return (
    <HomeScreenLayout
      tags={tags}
      tag={currentTag}
      data={data}
      onAddTagToItem={handleAddTag}
      onTagManagerPress={handleNewTag}
      onTagPress={setCurrentTag}
      onTaskItemPress={handleTaskItemPress}
      onItemPress={handleItemPress}
      onNewTask={handleNewTask}
      onNewNote={handleNewNote}
      onSettingPress={handleSettingPress}
      onFolderPress={handleNewTag}
      onSearchPress={handleSearchPress}
      onPin={handlePin}
      onDelete={handleDelete}
    />
  )
}

function createNoteQuery(tag?: Tag) {
  return (collection: Realm.Results<Note>) => {
    const sortDescriptor: SortDescriptor[] = [
      ['isPinned', true],
      ['updateAt', true],
    ]

    const result = collection
      .filtered('isDeleted == false AND isPrivate == false')
      .sorted(sortDescriptor)

    if (tag) {
      return result.filtered('$0 IN tags', tag)
    } else {
      return result
    }
  }
}
