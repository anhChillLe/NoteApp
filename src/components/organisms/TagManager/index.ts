import { InputActionSheet, useInputActionSheet } from './InputActionSheet'
import { TagManagerAppBar } from './AppBar'
import { TagManagerBottomMenuBar } from './BottomMenuBar'
import { memo } from 'react'

export const TagManager = {
  InputSheet: memo(InputActionSheet),
  AppBar: TagManagerAppBar,
  BottomMenuBar: memo(TagManagerBottomMenuBar),
}

export { useInputActionSheet }
