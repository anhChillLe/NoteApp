import { useNavigation } from '@react-navigation/native'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { BSON } from 'realm'
import { NoteEditProvider } from '~/components/organisms/NoteEdit/Provider'
import { NoteEditLayout } from '~/components/templates'
import { useRootRoute } from '~/navigation/root/hook'
import { useQuery, useRealm } from '~/services/database'
import { Note, Tag } from '~/services/database/model'
import { NoteData } from '~/services/database/model/Note'
import { useNoteEditor } from '~/store/noteEdit'

export const NoteEditScreen: FC = () => {
  const realm = useRealm()
  const navigation = useNavigation()
  const route = useRootRoute<'note_edit'>()

  const tags = useQuery(Tag)
  const [id, setId] = useState(new BSON.UUID(route.params?.id))
  const [updateTime, setUpdateTime] = useState<Date>()

  const handleNewTag = useCallback((text: string) => {
    if (text) {
      realm.write(() => {
        realm.create(Tag, Tag.generate({ name: text }))
      })
    }
  }, [])

  useEffect(() => {
    if (route.params.id) {
      const id = new BSON.UUID(route.params?.id)
      const { title, content, isPinned, taskList, isPrivate, tags } =
        realm.objectForPrimaryKey(Note, id)?.data || {}

      useNoteEditor.setState({
        title,
        content,
        taskList,
        isPinned,
        isPrivate,
        tags,
      })
    } else if (route.params.tagId) {
      const tag = realm.objectForPrimaryKey(
        Tag,
        new BSON.UUID(route.params.tagId),
      )
      useNoteEditor.setState({ tags: tag ? [tag] : [] })
    }
  }, [route.params, realm])

  useEffect(() => {
    const unsub = useNoteEditor.subscribe(state => {
      const { title, content, taskList, isPinned, isPrivate, tags } = state
      const data: NoteData = {
        type: route.params.type,
        title,
        content,
        taskList,
        isPinned,
        isPrivate,
        tags,
      }

      if (!title && !content) return

      realm.write(() => {
        const note = realm.objectForPrimaryKey(Note, id)
        if (note) {
          note.update(data)
          setUpdateTime(note.updateAt)
        } else {
          const generatedData = Note.generate(data)
          const { _id, updateAt } = realm.create(Note, generatedData)
          setId(_id)
          setUpdateTime(updateAt)
        }
      })
    })
    return unsub
  }, [realm, id, route.params, setId])

  useEffect(() => useNoteEditor.getState().reset, [])

  return (
    <NoteEditProvider
      value={{
        tags: tags.map(it => it),
        onBackPress: navigation.goBack,
        onNewTagSubmit: handleNewTag,
        updateTime,
      }}
    >
      <NoteEditLayout type={route.params.type} />
    </NoteEditProvider>
  )
}
