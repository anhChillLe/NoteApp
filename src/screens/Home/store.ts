import { OrderedCollection } from 'realm'
import { StateCreator, create } from 'zustand'
import { Note, Tag, TaskItem } from '~/services/database/model'
import Realm from 'realm'
import { realmConfig } from '~/services/database'
import { PersistOptions, createJSONStorage, persist } from 'zustand/middleware'
import { zustandStorage } from '~/services/storage'

type Mode = 'search' | 'select' | 'default'

interface HomeStateData {
  mode: Mode
  selecteds: Note[] | OrderedCollection<Note>
  searchValue: string
  currentTagId: string | null
  setCurrentTagId: (id: string | null) => void
}

interface HomeStateAction {
  setMode: (mode: Mode) => void
  select: (item: Note) => void
  setSelecteds: (items: Note[] | OrderedCollection<Note>) => void
  setSearchValue: (value: string) => void
  pinNotes: () => void
  deleteNotes: () => void
  privateNotes: () => void
  cloneNotes: () => void
  addTagToNote: (note: Note, tag: Tag) => void
  changeTaskItemStatus: (taskItem: TaskItem) => void
}

type HomeState = HomeStateData & HomeStateAction

const creator: StateCreator<HomeState> = (set, get) => {
  return {
    mode: 'default',
    selecteds: [],
    searchValue: '',
    currentTagId: null,
    setCurrentTagId(id) {
      set({ currentTagId: id })
    },
    setMode(mode) {
      if (mode === 'default') {
        set({ selecteds: [], searchValue: '' })
      }
      set({ mode })
    },
    select(item) {
      const selecteds = get().selecteds
      const newList = selecteds.filter(note => note.id !== item.id)
      if (newList.length === selecteds.length)
        set({ mode: 'select', selecteds: [...selecteds, item] })
      else set({ mode: 'select', selecteds: newList })
    },
    setSelecteds(items) {
      set({ selecteds: items })
    },
    setSearchValue(value) {
      set({ searchValue: value })
    },
    pinNotes() {
      const data = get().selecteds
      Realm.open(realmConfig)
        .then(realm => {
          realm.write(() => {
            data.forEach(item => {
              item.isPinned = !item.isPinned
            })
          })
        })
        .catch(console.log)
      set({
        mode: 'default',
        selecteds: [],
      })
    },
    deleteNotes() {
      const data = get().selecteds
      Realm.open(realmConfig)
        .then(realm => {
          realm.write(() => {
            data.forEach(item => {
              item.isDeleted = true
            })
          })
        })
        .catch(console.log)
      set({
        mode: 'default',
        selecteds: [],
      })
    },
    privateNotes() {
      const data = get().selecteds
      Realm.open(realmConfig)
        .then(realm => {
          realm.write(() => {
            data.forEach(item => {
              item.isPrivate = true
            })
          })
        })
        .catch(console.log)
      set({
        mode: 'default',
        selecteds: [],
      })
    },
    cloneNotes() {
      const data = get().selecteds.map(it => it.data)
      Realm.open(realmConfig)
        .then(realm => {
          realm.write(() => {
            data.forEach(it => {
              realm.create(Note, Note.generate(it))
            })
          })
        })
        .catch(console.log)
      set({
        mode: 'default',
        selecteds: [],
      })
    },
    addTagToNote(note, tag) {
      Realm.open(realmConfig)
        .then(realm => {
          realm.write(() => {
            if (note.tags.includes(tag)) return
            note.tags.push(tag)
          })
        })
        .catch(console.log)
    },
    changeTaskItemStatus(item) {
      Realm.open(realmConfig)
        .then(realm => {
          realm.write(() => {
            item.changeStatus()
          })
        })
        .catch(console.log)
    },
  }
}

const persistOptions: PersistOptions<
  HomeState,
  { currentTagId: string | null }
> = {
  name: 'home-storage',
  storage: createJSONStorage(() => zustandStorage),
  partialize: state => ({
    currentTagId: state.currentTagId,
  }),
}

const useHomeState = create(persist(creator, persistOptions))

export default useHomeState
