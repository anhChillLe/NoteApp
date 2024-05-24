import { memo } from 'react'
import { TagManagerBottomMenuBar } from './BottomMenuBar'
import { DefaultAppBar } from './DefaultAppBar'
import { TagManagerEmpty } from './Empty'
import { InputActionSheet } from './InputActionSheet'
import { SelectionAppBar } from './SelectionAppBar'

export namespace TagManager {
  export const InputSheet = memo(InputActionSheet)
  export const DefaultAppbar = memo(DefaultAppBar)
  export const SelectionAppbar = memo(SelectionAppBar)
  export const BottomMenubar = memo(TagManagerBottomMenuBar)
  export const Empty = memo(TagManagerEmpty)
}
