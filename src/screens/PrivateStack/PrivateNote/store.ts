import { StateCreator, create } from 'zustand'
import { Note, Tag } from '~/services/database/model'
import Realm from 'realm'
import { trigger } from 'react-native-haptic-feedback'
import { realmConfig } from '~/services/database'

type Mode = 'select' | 'default'

interface SelectionData {
  selecteds: Note[]
  mode: Mode
}

interface SelectionAction {
  select: (item: Note) => void
  setSelecteds: (items: Note[]) => void
  setMode: (mode: Mode) => void
  addTagToNote: (tag: Tag, note: Note) => void
  removeFromPrivate: () => void
  deleteItems: () => void
}

type Selection = SelectionData & SelectionAction

const creator: StateCreator<Selection> = (set, get) => ({
  selecteds: [],
  mode: 'default',
  setMode(mode) {
    if (mode === 'default') {
      set({ selecteds: [] })
    }
    set({ mode })
  },
  select(item) {
    set(state => {
      const newList = state.selecteds.filter(note => note.id !== item.id)
      if (newList.length === state.selecteds.length)
        set({ mode: 'select', selecteds: [...state.selecteds, item] })
      else set({ mode: 'select', selecteds: newList })
      return {
        mode: 'select',
        selecteds:
          newList.length === state.selecteds.length
            ? [...state.selecteds, item]
            : newList,
      }
    })
  },
  setSelecteds(items) {
    set({ selecteds: items })
  },
  addTagToNote(tag, note) {
    Realm.open(realmConfig)
      .then(realm => {
        realm.write(() => {
          if (note.tags.includes(tag)) return
          note.tags.push(tag)
        })
      })
      .catch(console.log)
  },
  removeFromPrivate() {
    set(state => {
      Realm.open(realmConfig)
        .then(realm => {
          realm.write(() => {
            state.selecteds.forEach(item => {
              item.isPrivate = false
            })
          })
        })
        .catch(console.log)
      return {
        selecteds: [],
        mode: 'default',
      }
    })
  },
  deleteItems() {
    set(state => {
      Realm.open(realmConfig)
        .then(realm => {
          realm.write(() => {
            realm.delete(state.selecteds)
          })
        })
        .catch(console.log)
      return {
        selecteds: [],
        mode: 'default',
      }
    })
  },
})

const usePrivateState = create(creator)

export default usePrivateState
