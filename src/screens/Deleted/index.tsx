import { useNavigation } from '@react-navigation/native'
import { FC, useCallback } from 'react'
import { trigger } from 'react-native-haptic-feedback'
import { DeletedNote } from '~/components/organisms'
import { DeletedNoteScreenLayout } from '~/components/templates/Delete'
import { useQuery, useRealm } from '~/services/database'
import { Note } from '~/services/database/model'
import { useDeletedSelection } from '~/store/delete'

export const DeletedNoteScreen: FC = () => {
  const realm = useRealm()
  const navigation = useNavigation()
  const notes = useHidedNotes()

  const selecteds = useDeletedSelection(state => state.selecteds)

  const restoreItems = useCallback(() => {
    realm.write(() => {
      selecteds.forEach(item => {
        item.isDeleted = false
      })
      trigger('effectTick')
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
    <DeletedNote.Provider
      value={{
        deleteItems,
        restoreItems,
        goBack: navigation.goBack,
        notes,
        openEditor,
      }}
    >
      <DeletedNoteScreenLayout />
    </DeletedNote.Provider>
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
