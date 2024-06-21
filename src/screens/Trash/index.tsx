import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { FC, useCallback } from 'react'
import { trigger } from 'react-native-haptic-feedback'
import { DeletedNoteProvider } from '~/components/Provider'
import { TrashScreenLayout } from '~/components/templates'
import { useQuery, useRealm } from '~/services/database'
import { Note } from '~/services/database/model'
import useTrashState from './store'
import { BackHandler } from 'react-native'

const TrashScreen: FC = () => {
  const { goBack, navigate } = useNavigation()
  const notes = useHidedNotes()

  const openEditor = useCallback((item: Note) => {
    navigate('editor', { type: item.type, id: item.id })
  }, [])

  const isInSelectMode = useTrashState(state => state.mode === 'select')
  const setMode = useTrashState(state => state.setMode)

  const backHandler = useCallback(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      isInSelectMode && setMode('default')
      return isInSelectMode
    })
    return listener.remove
  }, [setMode, isInSelectMode])

  useFocusEffect(backHandler)

  return (
    <DeletedNoteProvider value={{ goBack, notes, openEditor }}>
      <TrashScreenLayout />
    </DeletedNoteProvider>
  )
}

const useHidedNotes = () => {
  const notes = useQuery({
    type: Note,
    query: collection => {
      return collection.filtered('isDeleted == true AND isPrivate == false')
    },
  })
  return notes
}

export default TrashScreen
