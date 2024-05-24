import {
  ContextSelector,
  createContext,
  useContextSelector,
} from '@fluentui/react-context-selector'
import { Note, Tag } from '~/services/database/model'

interface NoteEditData {
  updateTime?: Date
  tags: Tag[]
  onBackPress: () => void
  onNewTagSubmit: (title: string) => void
}
const NoteEditContext = createContext<NoteEditData>({} as never)

const NoteEditProvider = NoteEditContext.Provider

const useNoteEdit = <T>(selector: ContextSelector<NoteEditData, T>) =>
  useContextSelector(NoteEditContext, selector)

export { NoteEditProvider, useNoteEdit }
