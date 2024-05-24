import {
  ContextSelector,
  createContext,
  useContextSelector,
} from '@fluentui/react-context-selector'
import { OrderedCollection } from 'realm'
import { Note } from '~/services/database/model'

interface PrivateNoteData {
  notes: OrderedCollection<Note>
  openEditor: (data: Note) => void
  removeFromPrivate: () => void
  deleteItems: () => void
  goBack: () => void
}

const PrivateNoteContext = createContext<PrivateNoteData>({} as never)

const PrivateNoteProvider = PrivateNoteContext.Provider

const usePrivateNote = <T>(selector: ContextSelector<PrivateNoteData, T>) =>
  useContextSelector(PrivateNoteContext, selector)

export { PrivateNoteProvider, usePrivateNote }
