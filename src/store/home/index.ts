import { StateCreator, create } from 'zustand'
import { Note } from '~/services/database/model'

interface HomeSearch {
  value: string
  isInSearchMode: boolean
  setValue: (value: string) => void
  enalble: () => void
  disable: () => void
}

const homeSearchStateCreater: StateCreator<HomeSearch> = (set, get) => {
  return {
    value: '',
    isInSearchMode: false,
    setValue: value => {
      set({ value })
    },
    enalble: () => {
      set({ isInSearchMode: true })
    },
    disable: () => {
      set({ isInSearchMode: false, value: '' })
    },
  }
}


interface Selection<T> {
  selecteds: T[]
  isInSelectMode: boolean
  select: (item: T) => void
  set: (items: T[]) => void
  enable: () => void
  disable: () => void
}

const homeSelectionStateCreater: StateCreator<Selection<Note>> = (
  set,
  get,
) => ({
  selecteds: [],
  isInSelectMode: false,
  select: item => {
    const selecteds = get().selecteds
    const newList = selecteds.filter(note => note.id !== item.id)
    if (newList.length === selecteds.length)
      set({ isInSelectMode: true, selecteds: [...selecteds, item] })
    else set({ isInSelectMode: true, selecteds: newList })
  },
  set: items => {
    set({ selecteds: items })
  },
  enable: () => {
    set({ isInSelectMode: true })
  },
  disable: () => {
    set({
      selecteds: [],
      isInSelectMode: false,
    })
  },
})

const useHomeSelect = create(homeSelectionStateCreater)
const useHomeSearch = create(homeSearchStateCreater)

export { useHomeSearch, useHomeSelect }
