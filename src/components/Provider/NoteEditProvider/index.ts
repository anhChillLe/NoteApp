import {
  ContextSelector,
  createContext,
  useContextSelector,
} from '../ContextSelector'
import { Note, Tag } from '~/services/database/model'

interface NoteEditData {
  data: Note | null
  tags: Tag[]
  onBackPress: () => void
  onNewTagSubmit: (title: string) => void
}
const NoteEditContext = createContext<NoteEditData>()

const NoteEditProvider = NoteEditContext.Provider

const useNoteEdit = <T>(selector: ContextSelector<NoteEditData, T>) =>
  useContextSelector(NoteEditContext, selector)

export { NoteEditProvider, useNoteEdit }
