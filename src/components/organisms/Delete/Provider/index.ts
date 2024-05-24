import {
  ContextSelector,
  createContext,
  useContextSelector,
} from '@fluentui/react-context-selector'
import { OrderedCollection } from 'realm'
import { Note } from '~/services/database/model'

interface DeletedNoteData {
  notes: OrderedCollection<Note>
  openEditor: (data: Note) => void
  restoreItems: () => void
  deleteItems: () => void
  goBack: () => void
}

const DeletedNoteContext = createContext<DeletedNoteData>({} as never)

const DeletedNoteProvider = DeletedNoteContext.Provider

const useDeletedNote = <T>(selector: ContextSelector<DeletedNoteData, T>) =>
  useContextSelector(DeletedNoteContext, selector)

export { DeletedNoteProvider, useDeletedNote }
