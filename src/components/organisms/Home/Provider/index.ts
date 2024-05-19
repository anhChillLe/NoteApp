import {
  ContextSelector,
  createContext,
  useContextSelector,
} from '@fluentui/react-context-selector'
import { OrderedCollection } from 'realm'
import { Note, Tag, TaskItem } from '~/services/database/model'

interface HomeData {
  notes: OrderedCollection<Note>
  tags: OrderedCollection<Tag>
  currentTag: Tag | null
  changeCurrentTag: (tag: Tag | null) => void
  openDeletedNote: () => void
  openPrivateNote: () => void
  openTagManager: () => void
  openEditor: (data: Note) => void
  openNewNoteEditor: () => void
  openNewTaskEditor: () => void
  openNewRecordEditor: () => void
  openNewImageEditor: () => void
  openNewPaintEditor: () => void
  openSetting: () => void
  changeTaskItemStatus: (taskItem: TaskItem) => void
  addTagToNote: (note: Note, tag: Tag) => void
  deleteNotes: () => void
  pinNotes: () => void
  privateNotes: () => void
}

const HomeContext = createContext<HomeData>({} as never)

const HomeProvider = HomeContext.Provider

const useHome = <T>(selector: ContextSelector<HomeData, T>) =>
  useContextSelector(HomeContext, selector)

export { useHome, HomeProvider }
