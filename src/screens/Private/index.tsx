import { useNavigation } from '@react-navigation/native'
import { FC, useCallback } from 'react'
import { trigger } from 'react-native-haptic-feedback'
import { PrivateNote } from '~/components/organisms'
import { PrivateNoteScreenLayout } from '~/components/templates'
import { useQuery, useRealm } from '~/services/database'
import { Note } from '~/services/database/model'
import { usePrivateSelection } from '~/store/private'

export const PrivateNoteScreen: FC = () => {
  const realm = useRealm()
  const navigation = useNavigation()
  const notes = useHidedNotes()

  const { disable, selecteds } = usePrivateSelection()

  const removeFromPrivate = useCallback(() => {
    realm.write(() => {
      selecteds.forEach(item => {
        item.isPrivate = false
      })
      trigger('effectTick')
      disable()
    })
  }, [realm, selecteds])

  const deleteItems = useCallback(() => {
    realm.write(() => {
      realm.delete(selecteds)
      trigger('effectTick')
    })
  }, [realm, selecteds])

  const openEditor = useCallback((item: Note) => {
    navigation.navigate('note_edit', { type: item.type, id: item.id })
  }, [])

  return (
    <PrivateNote.Provider
      value={{
        notes,
        removeFromPrivate,
        deleteItems,
        goBack: navigation.goBack,
        openEditor,
      }}
    >
      <PrivateNoteScreenLayout />
    </PrivateNote.Provider>
  )
}

const useHidedNotes = () => {
  const notes = useQuery(Note, collection => {
    return collection.filtered('isDeleted == false AND isPrivate == true')
  })
  return notes
}
