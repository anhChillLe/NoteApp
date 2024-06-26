import { useNavigation } from '@react-navigation/native'
import { isEqual } from 'lodash'
import React, { FC, useEffect } from 'react'
import { NoteEditProvider } from '~/components/Provider'
import { EditorScreenLayout } from '~/components/templates'
import { useRootRoute } from '~/navigation/Root/hook'
import useNoteEditor from '~/screens/Editor/store'
import { useObject, useQuery } from '~/services/database'
import { Note, Tag } from '~/services/database/model'
import { debounce } from '~/utils'

const EditorScreen: FC = () => {
  const navigation = useNavigation()
  const route = useRootRoute<'editor'>()

  const id = useNoteEditor(state => state.id)
  const tags = useQuery({ type: Tag })
  const note = useObject({ type: Note, primaryKey: id })

  // Auto save
  useEffect(() => {
    const saveOrUpdate = useNoteEditor.getState().saveOrUpdate
    const unsub = useNoteEditor.subscribe(
      state => ({ isInited: state.isInited, data: state.getData() }),
      (state, prevState) => {
        if (state.isInited === false) return
        if (state.isInited !== prevState.isInited) return
        debounce(saveOrUpdate, 300)()
      },
      { equalityFn: isEqual },
    )
    return unsub
  }, [])

  // Init form
  useEffect(() => {
    useNoteEditor.getState().init(route.params)
    return useNoteEditor.getState().reset
  }, [route.params])

  // Back on delete
  useEffect(() => {
    const unsub = useNoteEditor.subscribe(
      state => state.isDeleted,
      isDeleted => isDeleted && navigation.goBack(),
    )
    return unsub
  }, [navigation])

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
