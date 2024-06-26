import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { BackHandler, InteractionManager } from 'react-native'
import Realm, { BSON, Results, SortDescriptor } from 'realm'
import { HomeProvider } from '~/components/Provider'
import { HomeScreenLayout } from '~/components/templates'
import { useObject, useQuery } from '~/services/database'
import { Note, Tag } from '~/services/database/model'
import { combineQuery, normalize } from '~/services/database/utils'
import { debounce } from '~/utils'
import useHomeState from './store'

const HomeScreen: FC = () => {
  const navigation = useNavigation()

  const currentTagId = useHomeState(state => state.currentTagId)
  const [searchValue, setSearchValue] = useState<string | null>(null)

  const currentTag = useObject({
    type: Tag,
    primaryKey: new BSON.UUID(currentTagId!),
  })
  const tags = useQuery({ type: Tag, query: createTagQuery() })
  const notes = useQuery(
    { type: Note, query: createNoteQuery(currentTag, searchValue) },
    [currentTagId, searchValue],
  )

  const openEditor = useCallback(
    (item: Note) => {
      const params = {
        id: item.id,
        type: item.type,
        tagId: currentTagId,
      }
      navigation.navigate('editor', params)
    },
    [currentTagId],
  )

  const openDeletedNote = useCallback(() => {
    navigation.navigate('trash')
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
    navigation.navigate('editor', { type: 'note', tagId: currentTagId })
  }, [navigation, currentTagId])

  const openNewTaskEditor = useCallback(() => {
    navigation.navigate('editor', { type: 'task' })
  }, [navigation])

  const mode = useHomeState(state => state.mode)
  const setMode = useHomeState(state => state.setMode)

  const handler = useCallback(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      mode !== 'default' && setMode('default')
      return mode !== 'default'
    })
    return listener.remove
  }, [mode, setMode])

  useEffect(() => {
    const debouncedSetSearchVaue = debounce(setSearchValue, 300)
    const unsub = useHomeState.subscribe(({ searchValue, mode }) => {
      debouncedSetSearchVaue(mode === 'search' ? searchValue : null)
    })
    return unsub
  }, [setSearchValue])

  useFocusEffect(handler)

  useEffect(() => {
    navigation.addListener('blur', () => {
      useHomeState.getState().setMode('default')
    })
  }, [navigation])

  const value = {
    notes,
    tags,
    openEditor,
    openDeletedNote,
    openPrivateNote,
    openTagManager,
    openSetting,
    openNewNoteEditor,
    openNewTaskEditor,
  }

  return (
    <HomeProvider value={value}>
      <HomeScreenLayout />
    </HomeProvider>
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
      'normalizedTitle TEXT $0 OR normalizedContent TEXT $0 OR taskList.normalizedLabel TEXT $0',
      normalize(text),
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

export default HomeScreen
