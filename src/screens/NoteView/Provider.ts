import { Note, TaskItem } from 'note-app-database'
import { createContext, use } from 'react'
import { Reminder } from '~/app/providers/notification'

interface State {
  note: Note
  currentReminder: Reminder | null
  openEditor: () => void
  goBack: () => void
  openReminder: () => void
  openDetail: () => void
  changeTaskItemStatus: (taskItem: TaskItem) => void
}

const NoteViewContext = createContext<State>({} as State)

const NoteViewProvider = NoteViewContext.Provider

const useNoteView = () => use(NoteViewContext)

export { NoteViewProvider, useNoteView }
