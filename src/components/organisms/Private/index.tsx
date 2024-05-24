import { PrivateActionBar } from './ActionBar'
import { PrivateNoteProvider, usePrivateNote } from './Provider'

export namespace PrivateNote {
  export const Provider = PrivateNoteProvider
  export const Actionbar = PrivateActionBar
}

export { usePrivateNote }
