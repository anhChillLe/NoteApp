import { useNavigation } from '@react-navigation/native'
import React, { FC, useCallback, useState } from 'react'
import { BSON } from 'realm'
import { NoteEditLayout, NoteForm } from '~/components/templates'
import { useRootRoute } from '~/navigation/root/hook'
import { useObject, useQuery, useRealm } from '~/services/database'
import { Note, Tag } from '~/services/database/model'

export const NoteEditScreen: FC = () => {
  const realm = useRealm()
  const navigation = useNavigation()
  const route = useRootRoute<'note_edit'>()
  const tags = useQuery(Tag)
  const [id, setId] = useState(new BSON.UUID(route.params?.id))
  const note = useObject(Note, id)

  const handleDataChange = useCallback(
    (data: NoteForm) => {
      if (!data.content && !data.title) return
      realm.write(() => {
        const note = realm.objectForPrimaryKey(Note, id)

        if (note != null) {
          note.update(data)
        } else {
          const { _id } = realm.create(Note, Note.generate(data))
          setId(_id)
        }
      })
    },
    [id],
  )

  return (
    <NoteEditLayout
      tags={tags.map(it => it)}
      note={note}
      onChange={handleDataChange}
      onBackPress={navigation.goBack}
    />
  )
}
