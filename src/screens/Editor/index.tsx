import { useNavigation } from '@react-navigation/native'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { BSON } from 'realm'
import { NoteEditProvider } from '~/components/Provider'
import { EditorScreenLayout } from '~/components/templates'
import { useRootRoute } from '~/navigation/Root/hook'
import useNoteEditor from '~/screens/Editor/store'
import { useObject, useQuery, useRealm } from '~/services/database'
import { Note, Tag } from '~/services/database/model'
import { NoteData } from '~/services/database/model/Note'
import { debounce } from '~/utils'

const EditorScreen: FC = () => {
  const realm = useRealm()
  const navigation = useNavigation()
  const route = useRootRoute<'editor'>()

  const tags = useQuery({ type: Tag })
  const [id, setId] = useState(new BSON.UUID(route.params.id!))
  const note = useObject({ type: Note, primaryKey: id })

  const handleFormDataChange = useCallback(
    debounce((data: NoteData) => {
      if (!Note.isValidData(data)) return
      const note = realm.objectForPrimaryKey(Note, id)
      realm.write(() => {
        if (note) {
          note.update(data)
        } else {
          const results = Note.create(realm, data)
          setId(results._id)
        }
      })
    }, 300),
    [realm, id, setId],
  )

  // Init form
  useEffect(() => {
    useNoteEditor.getState().init(route.params)
  }, [route.params])

  // Auto save
  useEffect(() => {
    const unsub = useNoteEditor.subscribe(handleFormDataChange)
    return unsub
  }, [handleFormDataChange])

  // Back on delete
  useEffect(() => {
    const unsub = useNoteEditor.subscribe(({ isDeleted }) => {
      if (isDeleted) {
        navigation.goBack()
      }
    })
    return unsub
  }, [navigation])

  // Clear form state
  useEffect(() => useNoteEditor.getState().reset, [])

  return (
    <NoteEditProvider
      value={{
        data: note,
        tags,
        onBackPress: navigation.goBack,
      }}
    >
      <EditorScreenLayout />
    </NoteEditProvider>
  )
}
export default EditorScreen
