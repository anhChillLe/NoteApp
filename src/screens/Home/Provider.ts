import { Note, Tag, TaskItem } from 'note-app-database'
import { createContext, use } from 'react'
import { OrderedCollection } from 'realm'

export type HomeMode = 'search' | 'select' | 'default'

interface HomeData {
  currentTagId: string | null
  setCurrentTagId: (id: string | null) => void
  notes: OrderedCollection<Note>
  tags: OrderedCollection<Tag>
  openDeletedNote: () => void
  openPrivateNote: () => void
  openTagManager: () => void
  openEditor: (data: Note) => void
  openNewNoteEditor: (currentTagId: string | null) => void
  openNewTaskEditor: (currentTagId: string | null) => void
  openNewNoteEditorWithTag: (tagId: string) => void
  openReminder: () => void
  openSetting: () => void
  pinNotes: () => void
  unPinNotes: () => void
  deleteNotes: () => void
  privateNotes: () => void
  addTagToNote: (note: Note, tag: Tag) => void
  changeTaskItemStatus: (taskItem: TaskItem) => void
  select: (item: Note) => void
  searchValue: string
  setSearchValue: (value: string) => void
  mode: HomeMode
  setMode: (mode: HomeMode) => void
  selecteds: Set<string> | 'all'
  selectAll: () => void
  isAllPinned: boolean
}

const HomeContext = createContext<HomeData>({} as HomeData)

const useHome = () => use(HomeContext)

export { HomeContext, useHome }
