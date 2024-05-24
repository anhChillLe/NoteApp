import { useNavigation } from '@react-navigation/native'
import React, { FC, useCallback, useState } from 'react'
import { Results, SortDescriptor } from 'realm'
import { Home } from '~/components/organisms'
import { HomeScreenLayout } from '~/components/templates'
import { useQuery, useRealm } from '~/services/database'
import { Note, Tag, TaskItem } from '~/services/database/model'
import { combineQuery } from '~/services/database/utils'
import { useHomeSearch, useHomeSelect } from '~/store/home'

export const HomeScreen: FC = () => {
  const navigation = useNavigation()
  const realm = useRealm()

  const [currentTag, changeCurrentTag] = useState<Tag | null>(null)

  const searchValue = useHomeSearch(state => {
    return state.isInSearchMode ? state.value : null
  })

  const selecteds = useHomeSelect(state => state.selecteds)
  const disableSelect = useHomeSelect(state => state.disable)

  const tags = useQuery(Tag, createTagQuery())

  const notes = useQuery(Note, createNoteQuery(currentTag, searchValue), [
    currentTag,
    searchValue,
  ])

  const openEditor = useCallback(
    (item: Note) => {
      navigation.navigate('note_edit', {
        id: item.id,
        type: item.type,
        tagId: currentTag?.id,
      })
    },
    [currentTag],
  )

  const openDeletedNote = useCallback(() => {
    navigation.navigate('deleted')
  }, [navigation])

  const openPrivateNote = useCallback(() => {
    navigation.navigate('private')
  }, [navigation])

  const openTagManager = useCallback(() => {
    navigation.navigate('tag_manager')
  }, [navigation])

  const openSetting = useCallback(() => {
    navigation.navigate('setting')
  }, [navigation])

  const openNewNoteEditor = useCallback(() => {
    navigation.navigate('note_edit', { type: 'note', tagId: currentTag?.id })
  }, [navigation, currentTag])

  const openNewTaskEditor = useCallback(() => {
    navigation.navigate('note_edit', { type: 'task' })
  }, [navigation])

  const openNewRecordEditor = useCallback(() => {
    navigation.navigate('note_edit', { type: 'note' })
  }, [navigation])

  const openNewImageEditor = useCallback(() => {
    navigation.navigate('note_edit', { type: 'note' })
  }, [navigation])

  const openNewPaintEditor = useCallback(() => {
    navigation.navigate('note_edit', { type: 'note' })
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

  const pinNotes = useCallback(() => {
    realm.write(() => {
      selecteds.forEach(item => {
        item.isPinned = !item.isPinned
      })
      disableSelect()
    })
  }, [realm, selecteds])

  const deleteNotes = useCallback(() => {
    realm.write(() => {
      selecteds.forEach(item => {
        item.isDeleted = true
        console.log('delete', selecteds.length)
      })
      disableSelect()
    })
  }, [realm, selecteds])

  const privateNotes = useCallback(() => {
    realm.write(() => {
      selecteds.forEach(item => {
        item.isPrivate = true
      })
      disableSelect()
    })
  }, [realm, selecteds])

  return (
    <Home.Provider
      value={{
        notes,
        tags,
        currentTag,
        changeCurrentTag,
        openEditor,
        openDeletedNote,
        openPrivateNote,
        openTagManager,
        openSetting,
        openNewNoteEditor,
        openNewTaskEditor,
        openNewImageEditor,
        openNewRecordEditor,
        openNewPaintEditor,
        changeTaskItemStatus,
        addTagToNote,
        pinNotes,
        deleteNotes,
        privateNotes,
      }}
    >
      <HomeScreenLayout />
    </Home.Provider>
  )
}

function createNoteQuery(tag: Tag | null, searchValue: string | null) {
  return (collection: Realm.Results<Note>) => {
    const query = combineQuery(
      queryDefault(),
      queryByText(searchValue),
      queryByTag(tag),
    )
    return query(collection)
  }
}

const queryDefault = () => {
  const sortDescriptor: SortDescriptor[] = [
    ['isPinned', true],
    ['updateAt', true],
  ]
  return (collection: Results<Note>) => {
    return collection
      .filtered('isDeleted == false AND isPrivate == false')
      .sorted(sortDescriptor)
  }
}

const queryByText = (text: string | null) => {
  return (collection: Results<Note>) => {
    if (text === null || text.trim() === '') return collection
    return collection.filtered(
      'title TEXT $0 OR content TEXT $0 OR taskList.label TEXT $0',
      text,
    )
  }
}

const queryByTag = (tag: Tag | null) => {
  return (collection: Results<Note>) => {
    if (!tag) return collection
    return collection.filtered('$0 IN tags', tag)
  }
}

function createTagQuery() {
  return (collection: Realm.Results<Tag>) => {
    return collection.sorted('isPinned', true)
  }
}
