import {
  ContextSelector,
  createContext,
  useContextSelector,
} from '@fluentui/react-context-selector'
import { Note, Tag } from '~/services/database/model'

interface NoteEditData {
  data: Note | null
  tags: Tag[]
  onBackPress: () => void
  onNewTagSubmit: (title: string) => void
}
const NoteEditContext = createContext<NoteEditData>({} as never)

const NoteEditProvider = NoteEditContext.Provider

const useNoteEdit = <T>(selector: ContextSelector<NoteEditData, T>) =>
  useContextSelector(NoteEditContext, selector)

export { NoteEditProvider, useNoteEdit }
