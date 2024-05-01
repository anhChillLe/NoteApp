import { memo } from 'react'
import { TagManagerBottomMenuBar } from './BottomMenuBar'
import { DefaultAppBar } from './DefaultAppBar'
import { InputActionSheet, useInputActionSheet } from './InputActionSheet'
import { SelectionAppBar } from './SelectionAppBar'
import { TagManagerEmpty } from './Empty'

export namespace TagManager {
  export const InputSheet = memo(InputActionSheet)
  export const DefaultAppbar = memo(DefaultAppBar)
  export const SelectionAppbar = memo(SelectionAppBar)
  export const BottomMenubar = memo(TagManagerBottomMenuBar)
  export const Empty = memo(TagManagerEmpty)
}

export { useInputActionSheet }
