import { memo } from 'react'
import { OrderedCollection } from 'realm'
import { Note, Tag } from '~/services/database/model'
import {
  ContextSelector,
  createContext,
  useContextSelector,
} from '../ContextSelector'

interface HomeData {
  notes: OrderedCollection<Note>
  tags: OrderedCollection<Tag>
  openDeletedNote: () => void
  openPrivateNote: () => void
  openTagManager: () => void
  openEditor: (data: Note) => void
  openNewNoteEditor: () => void
  openNewTaskEditor: () => void
  openSetting: () => void
}

const HomeContext = createContext<HomeData>()

const HomeProvider = memo(HomeContext.Provider)

const useHome = <T>(selector: ContextSelector<HomeData, T>) => {
  return useContextSelector(HomeContext, selector)
}

export { HomeProvider, useHome }
