import { Note } from 'note-app-database'
import { createContext, use } from 'react'

interface SetReminderState {
  data: Note
  goBack: () => void
  repeatMode: RepeatMode
  setRepeatMode: (mode: RepeatMode) => void
  time: Date
  setTime: (date: Date) => void
  setReminder: (onNoPermission: () => void) => void
  cancelReminder: () => void
}

const SetReminderContext = createContext<SetReminderState>(
  {} as SetReminderState,
)

const SetReminderProvider = SetReminderContext.Provider

const useSetReminder = () => use(SetReminderContext)

export { SetReminderProvider, useSetReminder }
