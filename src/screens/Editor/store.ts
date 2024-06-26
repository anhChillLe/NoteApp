import Realm, { BSON } from 'realm'
import { StateCreator, create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { realmConfig } from '~/services/database'
import { Note, Tag } from '~/services/database/model'
import { NoteData } from '~/services/database/model/Note'
import { TaskItemData } from '~/services/database/model/TaskItem'

interface InitialParams {
  type: NoteType
  id?: string | null
  tagId?: string | null
  isPrivate?: boolean
}

interface NoteEditData extends NoteData {
  isInited: boolean
  id: BSON.UUID
}

interface NoteEditAction {
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
  createTag: (name: string) => void
  init: (params: InitialParams) => void
  reset: () => void
  getData: () => NoteData
  saveOrUpdate: () => void
}

const initialData: NoteEditData = {
  isInited: false,
  id: new BSON.UUID(),
  type: 'note',
  title: '',
  content: '',
  taskList: [],
  tags: [],
  isPinned: false,
  isPrivate: false,
  isDeleted: false,
}

const creator: StateCreator<NoteEditData & NoteEditAction> = (set, get) => {
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
        taskList: [...state.taskList, { isChecked: false, label }],
      }))
    },
    setTaskItemLabel(index, label) {
      set(state => {
        const newList = [...state.taskList]
        newList[index] = { ...newList[index], label }
        return {
          taskList: newList,
        }
      })
    },

    changeTaskItemStatus(index) {
      set(state => {
        const newList = [...state.taskList]
        const item = newList[index]
        newList[index].isChecked = !item.isChecked
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
      if (get().isInited) return
      Realm.open(realmConfig).then(realm => {
        if (id) {
          const uuid = new BSON.UUID(id)
          set({ id: uuid })
          const note = realm.objectForPrimaryKey(Note, uuid)
          if (note === null) return
          const { title, content, isPinned, taskList, isPrivate, tags } =
            note.data

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

        set({ type, isInited: true })
      })
    },
    reset() {
      set(initialData)
    },
    getData() {
      const {
        type,
        title,
        content,
        taskList,
        tags,
        isPinned,
        isPrivate,
        isDeleted,
      } = get()

      // Array at last to optimize compare function
      return {
        type,
        title,
        content,
        isPinned,
        isPrivate,
        isDeleted,
        tags,
        taskList,
      }
    },
    saveOrUpdate() {
      Realm.open(realmConfig).then(realm => {
        if (!get().isInited) return
        const data = get().getData()
        const id = get().id
        if (!Note.isValidData(data)) return
        const note = realm.objectForPrimaryKey(Note, id)
        realm.write(() => {
          if (note) {
            note.update(data)
          } else {
            const results = Note.create(realm, data)
            set({ id: results._id })
          }
        })
      })
    },
  }
}

const useNoteEditor = create(subscribeWithSelector(creator))

export default useNoteEditor
export type { NoteEditData }
