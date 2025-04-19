import { Note, NoteData, Tag, TaskItemData } from 'note-app-database'
import { createContext, use } from 'react'
import { BSON, OrderedCollection } from 'realm'

export type TaskItemDataWithId = TaskItemData & { id: BSON.UUID }

export interface NoteEditData extends NoteData {
  taskList: TaskItemDataWithId[]
}

interface NoteEditState extends NoteEditData {
  note: Note | null
  allTags: Tag[] | OrderedCollection<Tag>
  goBack: () => void
  openTagEditor: () => void
  openDetail: () => void
  setTitle: (text: string) => void
  setContent: (text: string) => void
  addTaskItem: (label: string) => void
  setTaskItemLabel: (index: number, label: string) => void
  changeTaskItemStatus: (index: number) => void
  removeTaskItem: (index: number) => void
  setTags: (tags: Tag[]) => void
  setIsPinned: (bool: boolean) => void
  setIsPrivate: (bool: boolean) => void
  setIsDeleted: (bool: boolean) => void
}

const NoteEditContext = createContext<NoteEditState>({} as NoteEditState)

const NoteEditProvider = NoteEditContext.Provider

const useNoteEdit = () => use(NoteEditContext)

export { NoteEditProvider, useNoteEdit }
