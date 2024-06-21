import { useNavigation } from '@react-navigation/native'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { BSON } from 'realm'
import { NoteEditProvider } from '~/components/Provider'
import { EditorScreenLayout } from '~/components/templates'
import { useRootRoute } from '~/navigation/Root/hook'
import useNoteEditor, { NoteEditData } from '~/screens/Editor/store'
import { useObject, useQuery, useRealm } from '~/services/database'
import { Note, Tag } from '~/services/database/model'
import { debounce } from '~/utils'

const EditorScreen: FC = () => {
  const realm = useRealm()
  const navigation = useNavigation()
  const route = useRootRoute<'editor'>()

  const tags = useQuery({ type: Tag })
  const [id, setId] = useState(new BSON.UUID(route.params.id!))
  const note = useObject({ type: Note, primaryKey: id })

  const handleNewTag = useCallback(
    (text: string) => {
      if (text) {
        realm.write(() => {
          realm.create(Tag, Tag.generate({ name: text }))
        })
      }
    },
    [realm],
  )

  const handleFormDataChange = useCallback(
    debounce((data: NoteEditData, prevData: NoteEditData) => {
      if (!data.title && !data.content) return

      realm.write(() => {
        const note = realm.objectForPrimaryKey(Note, id)
        if (note) {
          const changes = getChanges(data, prevData)
          note.update(changes)
        } else {
          const generatedData = Note.generate(data)
          const { _id } = realm.create(Note, generatedData)
          setId(_id)
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
        tags: tags.map(it => it),
        onBackPress: navigation.goBack,
        onNewTagSubmit: handleNewTag,
      }}
    >
      <EditorScreenLayout />
    </NoteEditProvider>
  )
}

const getChanges = (
  data: NoteEditData,
  prevData: NoteEditData,
): Partial<NoteEditData> => {
  const changes: Partial<NoteEditData> = {}

  for (const k in data) {
    const key = k as keyof NoteEditData
    if (data.hasOwnProperty(key) && data[key] !== prevData[key]) {
      changes[key] = data[key] as never
    }
  }

  return changes
}

export default EditorScreen
