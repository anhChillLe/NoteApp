import { temporal } from 'zundo'
import { StateCreator, create } from 'zustand'
import { Note, Tag } from '~/services/database/model'
import { TaskItemData } from '~/services/database/model/TaskItem'
import Realm, { BSON, open } from 'realm'
import { realmConfig } from '~/services/database'

interface NoteData {
  type: NoteType
  title: string
  content: string
  taskList: TaskItemData[]
  tags: Tag[]
  isPinned: boolean
  isPrivate: boolean
  isDeleted: boolean
}

interface InitialParams {
  type: NoteType
  id?: string | null
  tagId?: string | null
  isPrivate?: boolean
}

interface NoteEditData extends NoteData {
  setTitle: (text: string) => void
  setContent: (text: string) => void
  addTaskItem: (label: string) => void
  setTaskItemLabel: (index: number, label: string) => void
  changeTaskItemStatus: (index: number) => void
  disableTaskItem: (index: number) => void
  removeTaskItem: (index: number) => void
  setTags: (tags: Tag[]) => void
  setIsPinned: (bool: boolean) => void
  setIsPrivate: (bool: boolean) => void
  setIsDeleted: (bool: boolean) => void
  createTag: (name: string) => void
  init: (params: InitialParams) => void
  reset: () => void
}

const initialData: NoteData = {
  type: 'note',
  title: '',
  content: '',
  taskList: [],
  tags: [],
  isPinned: false,
  isPrivate: false,
  isDeleted: false,
}

const creator: StateCreator<NoteEditData> = (set, get) => {
  return {
    ...initialData,
    setTitle(title) {
      set({ title })
    },
    setContent(content) {
      set({ content })
    },
    addTaskItem(label) {
      set(state => ({
        taskList: [...state.taskList, { status: 'unchecked', label }],
      }))
    },
    setTaskItemLabel(index, label) {
      set(state => {
        const newList = [...state.taskList]
        newList[index].label = label
        return {
          taskList: newList,
        }
      })
    },
    disableTaskItem(index) {
      set(state => {
        const newList = [...state.taskList]
        const item = newList[index]
        item.status =
          item.status === 'indeterminate' ? 'unchecked' : 'indeterminate'
        return {
          taskList: newList,
        }
      })
    },
    changeTaskItemStatus(index) {
      set(state => {
        const newList = [...state.taskList]
        const item = newList[index]
        newList[index].status = (() => {
          switch (item.status) {
            case 'checked':
              return 'unchecked'
            case 'unchecked':
              return 'checked'
            case 'indeterminate':
              return item.status
          }
        })()
        return {
          taskList: newList,
        }
      })
    },
    removeTaskItem(index) {
      set(state => {
        const newList = [...state.taskList]
        newList.splice(index, 1)
        return {
          taskList: newList,
        }
      })
    },
    setTags(tags) {
      set({ tags })
    },
    setIsPinned(isPinned) {
      set({ isPinned })
    },
    setIsDeleted(isDeleted) {
      set({ isDeleted })
    },
    setIsPrivate(isPrivate) {
      set({ isPrivate })
    },
    createTag(name) {
      Realm.open(realmConfig).then(realm => {
        Tag.create(realm, { name, isPinned: false })
      })
    },
    init({ type, id, tagId, isPrivate }) {
      Realm.open(realmConfig).then(realm => {
        if (id) {
          const note = realm.objectForPrimaryKey(Note, new BSON.UUID(id))
          const { title, content, isPinned, taskList, isPrivate, tags } =
            note?.data || {}

          set({
            title,
            content,
            taskList,
            isPinned,
            isPrivate,
            tags,
          })
        } else if (tagId) {
          const tag = realm.objectForPrimaryKey(Tag, new BSON.UUID(tagId))
          set({ tags: tag ? [tag] : [] })
        }

        if (isPrivate) {
          set({ isPrivate })
        }

        set({ type })
      })
    },
    reset() {
      set(initialData)
    },
  }
}

const useNoteEditor = create(temporal(creator))

export default useNoteEditor
export type { NoteEditData }
