import { Note } from 'note-app-database'
import { createContext, use } from 'react'
import { OrderedCollection } from 'realm'

type Mode = 'select' | 'default'

interface DeletedNoteData {
  selecteds: Set<string> | 'all'
  mode: Mode
  notes: OrderedCollection<Note>
  openEditor: (data: Note) => void
  goBack: () => void
  select: (item: Note) => void
  selectAll: () => void
  setMode: (mode: Mode) => void
  deleteNotes: () => void
  restoreNotes: () => void
}

const TrashContext = createContext<DeletedNoteData>({} as DeletedNoteData)

const TrashProvider = TrashContext.Provider

const useTrash = () => use(TrashContext)

export { TrashProvider, useTrash }
