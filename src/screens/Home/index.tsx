import { useNavigation } from '@react-navigation/native'
import React, { FC, useCallback, useState } from 'react'
import { SortDescriptor } from 'realm'
import { Home } from '~/components/organisms'
import { HomeScreenLayout } from '~/components/templates'
import { useQuery, useRealm } from '~/services/database'
import { Note, Tag, TaskItem } from '~/services/database/model'

export const HomeScreen: FC = () => {
  const navigation = useNavigation()
  const realm = useRealm()

  const [currentTag, changeCurrentTag] = useState<Tag | null>(null)

  const tags = useQuery(Tag, createTagQuery())

  const notes = useQuery(Note, createNoteQuery(currentTag), [currentTag])

  const openEditor = useCallback((data: Note) => {
    const des = data?.type === 'task' ? 'task_edit' : 'note_edit'
    navigation.navigate(des, { id: data.id })
  }, [])

  const openDeletedNote = useCallback(() => {}, [])

  const openHidedNote = useCallback(() => {}, [])

  const openSearch = useCallback(() => {}, [])

  const openTagManager = useCallback(() => {
    navigation.navigate('tag_manager')
  }, [navigation])

  const openSetting = useCallback(() => {
    navigation.navigate('setting')
  }, [navigation])

  const openNewNoteEditor = useCallback(() => {
    navigation.navigate('note_edit')
  }, [navigation])

  const openNewTaskEditor = useCallback(() => {
    navigation.navigate('task_edit')
  }, [navigation])

  const openNewRecordEditor = useCallback(() => {
    navigation.navigate('task_edit')
  }, [navigation])

  const openNewImageEditor = useCallback(() => {
    navigation.navigate('task_edit')
  }, [navigation])

  const openNewPaintEditor = useCallback(() => {
    navigation.navigate('task_edit')
  }, [navigation])

  const changeTaskItemStatus = useCallback(
    (item: TaskItem) => {
      realm.write(() => {
        item.changeStatus()
      })
    },
    [realm],
  )

  const addTagToNote = useCallback(
    (note: Note, tag: Tag) => {
      realm.write(() => {
        if (note.tags.includes(tag)) return
        note.tags.push(tag)
      })
    },
    [realm],
  )

  const pinNotes = useCallback(
    (...items: Note[]) => {
      realm.write(() => {
        items.forEach(item => {
          item.isPinned = !item.isPinned
        })
      })
    },
    [realm],
  )

  const deleteNotes = useCallback(
    (...items: Note[]) => {
      realm.write(() => {
        items.forEach(item => {
          item.isDeleted = true
        })
      })
    },
    [realm],
  )

  const hideNotes = useCallback(
    (...items: Note[]) => {
      realm.write(() => {
        items.forEach(item => {
          item.isHided = true
        })
      })
    },
    [realm],
  )

  return (
    <Home.Provider
      value={{
        notes,
        tags,
        currentTag,
        changeCurrentTag,
        openEditor,
        openDeletedNote,
        openHidedNote,
        openTagManager,
        openSetting,
        openSearch,
        openNewNoteEditor,
        openNewTaskEditor,
        openNewImageEditor,
        openNewRecordEditor,
        openNewPaintEditor,
        changeTaskItemStatus,
        addTagToNote,
        pinNotes,
        hideNotes,
        deleteNotes,
      }}
    >
      <HomeScreenLayout />
    </Home.Provider>
  )
}

function createNoteQuery(tag?: Tag | null) {
  return (collection: Realm.Results<Note>) => {
    const sortDescriptor: SortDescriptor[] = [
      ['isPinned', true],
      ['updateAt', true],
    ]

    const result = collection
      .filtered(
        'isDeleted == false AND isPrivate == false AND isHided == false',
      )
      .sorted(sortDescriptor)

    if (tag) {
      return result.filtered('$0 IN tags', tag)
    } else {
      return result
    }
  }
}

function createTagQuery() {
  return (collection: Realm.Results<Tag>) => {
    return collection.sorted('isPinned', true)
  }
}
