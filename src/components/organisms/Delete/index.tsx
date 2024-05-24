import { DeletedActionBar } from './ActionBar'
import { DeletedNoteProvider, useDeletedNote } from './Provider'

export namespace DeletedNote {
  export const Provider = DeletedNoteProvider
  export const ActionBar = DeletedActionBar
}

export { useDeletedNote }
