import { StateCreator, create } from 'zustand'
import Realm from 'realm'
import { realmConfig } from '~/services/database'
import { Tag } from '~/services/database/model'

type TagData = { name: string; isSelected: boolean }

interface TagInitData {
  data: TagData[]
}

interface TagInitAction {
  toggleItem: (index: number) => void
  createTags: () => void
}

type TagInitState = TagInitData & TagInitAction

const tagsEng: TagData[] = [
  { name: 'Work', isSelected: true },
  { name: 'Family', isSelected: true },
  { name: 'Health', isSelected: true },
  { name: 'Goals', isSelected: false },
  { name: 'Study', isSelected: true },
  { name: 'Hobbies', isSelected: false },
  { name: 'Travel', isSelected: false },
  { name: 'Finance', isSelected: false },
  { name: 'Technology', isSelected: false },
  { name: 'Food', isSelected: false },
  { name: 'Books', isSelected: false },
  { name: 'Movies', isSelected: false },
  { name: 'Sports', isSelected: false },
  { name: 'Shopping', isSelected: false },
  { name: 'Important', isSelected: false },
]

const creator: StateCreator<TagInitState> = (set, get) => {
  return {
    data: tagsEng,
    toggleItem(index) {
      set(state => {
        const newData = [...state.data]
        newData[index].isSelected = !newData[index].isSelected
        return { data: newData }
      })
    },
    createTags() {
      const selecteds = get().data.filter(it => it.isSelected)
      Realm.open(realmConfig)
        .then(realm => {
          realm.write(() => {
            selecteds.forEach(item => {
              Tag.create(realm, { name: item.name, isPinned: false })
            })
          })
        })
        .catch(console.log)
    },
  }
}

const useTagInit = create(creator)

export default useTagInit
