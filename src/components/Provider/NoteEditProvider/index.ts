import { OrderedCollection } from 'realm'
import {
  ContextSelector,
  createContext,
  useContextSelector,
} from '../ContextSelector'
import { Note, Tag } from '~/services/database/model'

interface NoteEditData {
  data: Note | null
  tags: Tag[] | OrderedCollection<Tag>
  onBackPress: () => void
}
const NoteEditContext = createContext<NoteEditData>()

const NoteEditProvider = NoteEditContext.Provider

const useNoteEdit = <T>(selector: ContextSelector<NoteEditData, T>) =>
  useContextSelector(NoteEditContext, selector)

export { NoteEditProvider, useNoteEdit }
