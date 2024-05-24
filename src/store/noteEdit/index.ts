import { temporal } from 'zundo'
import { StateCreator, create } from 'zustand'
import { Tag } from '~/services/database/model'
import { TaskItemData } from '~/services/database/model/TaskItem'

interface NoteData {
  title: string
  content: string
  taskList: TaskItemData[]
  tags: Tag[]
  isPinned: boolean
  isPrivate: boolean
}

type Updater<T> = <K extends keyof T>(key: K) => (value: T[K]) => void

interface NoteEditData extends NoteData {
  update: Updater<NoteData>
  reset: () => void
}

const initialData: NoteData = {
  title: '',
  content: '',
  taskList: [],
  tags: [],
  isPinned: false,
  isPrivate: false,
}

const creator: StateCreator<NoteEditData> = set => {
  return {
    ...initialData,
    update: key => value => set({ [key]: value }),
    reset: () => {
      set(initialData)
    },
  }
}

const useNoteEditor = create(temporal(creator))

export { useNoteEditor }
