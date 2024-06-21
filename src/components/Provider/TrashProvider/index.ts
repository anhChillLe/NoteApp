import {
  ContextSelector,
  createContext,
  useContextSelector,
} from '../ContextSelector'
import { OrderedCollection } from 'realm'
import { Note } from '~/services/database/model'

interface DeletedNoteData {
  notes: OrderedCollection<Note>
  openEditor: (data: Note) => void
  goBack: () => void
}

const DeletedNoteContext = createContext<DeletedNoteData>()

const DeletedNoteProvider = DeletedNoteContext.Provider

const useDeletedNote = <T>(selector: ContextSelector<DeletedNoteData, T>) =>
  useContextSelector(DeletedNoteContext, selector)

export { DeletedNoteProvider, useDeletedNote }
