import { Note, Tag } from 'note-app-database'
import { createContext, use } from 'react'
import { OrderedCollection } from 'realm'

export type PrivateMode = 'select' | 'default'

interface PrivateNoteData {
  selecteds: Set<string> | 'all'
  mode: PrivateMode
  notes: OrderedCollection<Note>
  tags: OrderedCollection<Tag>
  currentTagId: string | null
  openEditor: (data: Note) => void
  openNewNoteEditor: () => void
  openNewTaskEditor: () => void
  changeCurrentTagId: (tag: string | null) => void
  goBack: () => void
  select: (item: Note) => void
  selectAll: () => void
  setMode: (mode: PrivateMode) => void
  addTagToNote: (tag: Tag, note: Note) => void
  removeFromPrivate: () => void
  deleteItems: () => void
}

const PrivateNoteContext = createContext<PrivateNoteData>({} as PrivateNoteData)

const PrivateNoteProvider = PrivateNoteContext.Provider

const usePrivateNote = () => use(PrivateNoteContext)

export { PrivateNoteProvider, usePrivateNote }
