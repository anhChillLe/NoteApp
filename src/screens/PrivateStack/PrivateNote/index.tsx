import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { FC, useCallback, useState } from 'react'
import { BackHandler } from 'react-native'
import { BSON, Results, SortDescriptor } from 'realm'
import { PrivateNoteProvider } from '~/components/Provider'
import { PrivateScreenLayout } from '~/components/templates'
import { useObject, useQuery } from '~/services/database'
import { Note, Tag } from '~/services/database/model'
import { combineQuery } from '~/services/database/utils'
import usePrivateState from './store'

const PrivateNoteScreen: FC = () => {
  const navigation = useNavigation()
  const tags = useQuery({ type: Tag })
  const [currentTagId, changeCurrentTagId] = useState<string | null>(null)
  const currentTag = useObject({
    type: Tag,
    primaryKey: new BSON.UUID(currentTagId!),
  })
  const notes = useHidedNotes(currentTag)

  const mode = usePrivateState(state => state.mode)
  const setMode = usePrivateState(state => state.setMode)

  const openEditor = useCallback((item: Note) => {
    navigation.navigate('editor', { type: item.type, id: item.id })
  }, [])

  const openNewNoteEditor = useCallback(() => {
    navigation.navigate('editor', {
      type: 'note',
      tagId: currentTagId,
      isPrivate: true,
    })
  }, [navigation])

  const openNewTaskEditor = useCallback(() => {
    navigation.navigate('editor', {
      type: 'task',
      tagId: currentTagId,
      isPrivate: true,
    })
  }, [navigation])

  const openSetting = useCallback(() => {
    navigation.navigate('setting')
  }, [navigation])

  const focusHanlder = useCallback(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      mode === 'select' && setMode('default')
      return mode === 'select'
    })
    return listener.remove
  }, [])

  useFocusEffect(focusHanlder)

  return (
    <PrivateNoteProvider
      value={{
        notes,
        tags,
        currentTagId,
        changeCurrentTagId,
        goBack: navigation.goBack,
        openEditor,
        openNewNoteEditor,
        openNewTaskEditor,
        openSetting,
      }}
    >
      <PrivateScreenLayout />
    </PrivateNoteProvider>
  )
}

const useHidedNotes = (tag: Tag | null) => {
  const query = combineQuery(queryDefault(), queryByTag(tag))

  const notes = useQuery(
    {
      type: Note,
      query,
    },
    [tag],
  )
  return notes
}

const queryByTag = (tag: Tag | null) => {
  return (collection: Results<Note>) => {
    if (!tag) return collection
    return collection.filtered('$0 IN tags', tag)
  }
}

const queryDefault = () => {
  const sortDescriptor: SortDescriptor[] = [
    ['isPinned', true],
    ['updateAt', true],
  ]
  return (collection: Results<Note>) => {
    return collection
      .filtered('isDeleted == false AND isPrivate == true')
      .sorted(sortDescriptor)
  }
}

export default PrivateNoteScreen
