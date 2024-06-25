import { StateCreator, create } from 'zustand'
import { Tag } from '~/services/database/model'
import Realm, { OrderedCollection } from 'realm'
import { realmConfig } from '~/services/database'
import useHomeState from '../Home/store'

type Mode = 'select' | 'default'

interface SelectionData {
  selecteds: Tag[] | OrderedCollection<Tag>
  mode: Mode
}

interface SelectionAction {
  select: (item: Tag) => void
  setSelecteds: (items: Tag[] | OrderedCollection<Tag>) => void
  setMode: (mode: Mode) => void
  pinTags: () => void
  deleteTags: () => void
  createTag: (name: string) => void
  renameTag: (name: string) => void
}

type Selection = SelectionData & SelectionAction

const creator: StateCreator<Selection> = (set, get) => ({
  selecteds: [],
  mode: 'default',
  setMode(newMode) {
    if (newMode === 'default') {
      set({ selecteds: [] })
    }
    set({ mode: newMode })
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
  pinTags() {
    set(state => {
      Realm.open(realmConfig)
        .then(realm => {
          realm.write(() => {
            const hasPinned = state.selecteds.some(tag => tag.isPinned)
            state.selecteds.forEach(tag => (tag.isPinned = !hasPinned))
          })
        })
        .catch(console.log)
      return {
        mode: 'default',
        selecteds: [],
      }
    })
  },
  deleteTags() {
    set(state => {
      Realm.open(realmConfig)
        .then(realm => {
          realm.write(() => {
            realm.delete(state.selecteds)
            if (
              state.selecteds.some(
                it => it.id === useHomeState.getState().currentTagId,
              )
            ) {
              useHomeState.getState().setCurrentTagId(null)
            }
          })
        })
        .catch(console.log)
      return {
        mode: 'default',
        selecteds: [],
      }
    })
  },
  createTag(name) {
    Realm.open(realmConfig)
      .then(realm => {
        realm.write(() => {
          realm.create(Tag, Tag.generate({ name }))
        })
      })
      .catch(console.log)
  },
  renameTag(name) {
    Realm.open(realmConfig)
      .then(realm => {
        realm.write(() => {
          const item = get().selecteds[0]
          if (item) item.name = name
        })
      })
      .catch(console.log)
  },
})
const useTagMangeState = create(creator)

export default useTagMangeState
