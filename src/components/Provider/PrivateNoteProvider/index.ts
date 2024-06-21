import {
  ContextSelector,
  createContext,
  useContextSelector,
} from '../ContextSelector'
import { OrderedCollection } from 'realm'
import { Note, Tag } from '~/services/database/model'

interface PrivateNoteData {
  notes: OrderedCollection<Note>
  tags: OrderedCollection<Tag>
  currentTagId: string | null
  openEditor: (data: Note) => void
  openNewNoteEditor: () => void
  openNewTaskEditor: () => void
  openSetting: () => void
  changeCurrentTagId: (tag: string | null) => void
  goBack: () => void
}

const PrivateNoteContext = createContext<PrivateNoteData>()

const PrivateNoteProvider = PrivateNoteContext.Provider

const usePrivateNote = <T>(selector: ContextSelector<PrivateNoteData, T>) =>
  useContextSelector(PrivateNoteContext, selector)

export { PrivateNoteProvider, usePrivateNote }
