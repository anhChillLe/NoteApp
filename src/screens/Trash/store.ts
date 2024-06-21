import { StateCreator, create } from 'zustand'
import { Note } from '~/services/database/model'
import Realm, { OrderedCollection } from 'realm'
import { trigger } from 'react-native-haptic-feedback'
import { realmConfig } from '~/services/database'

type Mode = 'select' | 'default'

interface SelectionData {
  selecteds: Note[] | OrderedCollection<Note>
  mode: Mode
}

interface SelectionAction {
  select: (item: Note) => void
  setSelecteds: (items: Note[] | OrderedCollection<Note>) => void
  setMode: (mode: Mode) => void
  deleteNotes: () => void
  restoreNotes: () => void
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
    const selecteds = get().selecteds
    const newList = selecteds.filter(note => note.id !== item.id)
    if (newList.length === selecteds.length)
      set({ mode: 'select', selecteds: [...selecteds, item] })
    else set({ mode: 'select', selecteds: newList })
  },
  setSelecteds(items) {
    set({ selecteds: items })
  },
  deleteNotes() {
    set(state => {
      Realm.open(realmConfig)
        .then(realm => {
          realm.write(() => {
            realm.delete(state.selecteds)
            trigger('effectTick')
          })
        })
        .catch(console.log)
      return {
        selecteds: [],
        mode: 'default',
      }
    })
  },
  restoreNotes() {
    set(state => {
      Realm.open(realmConfig)
        .then(realm => {
          realm.write(() => {
            state.selecteds.forEach(item => {
              item.isDeleted = false
            })
            trigger('effectTick')
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

const useTrashState = create(creator)

export default useTrashState
