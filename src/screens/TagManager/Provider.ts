import { Tag } from 'note-app-database'
import { createContext, use } from 'react'
import { OrderedCollection } from 'realm'

interface TagManagerScreenData {
  mode: 'select' | 'default'
  tags: OrderedCollection<Tag>
  select: (item: Tag) => void
  selectAll: () => void
  setMode: (mode: 'select' | 'default') => void
  goBack: () => void
  selecteds: Set<string> | 'all'
  togglePinTags: () => void
  deleteTags: () => void
  openTagEditor: () => void
}

const TagManagerContext = createContext<TagManagerScreenData>(
  {} as TagManagerScreenData,
)

const TagManagerProvider = TagManagerContext.Provider

const useTagManager = () => use(TagManagerContext)

export { TagManagerProvider, useTagManager }
