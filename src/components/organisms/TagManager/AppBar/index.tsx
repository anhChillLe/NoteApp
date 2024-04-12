import { memo } from 'react'
import { DefaultAppBar } from './DefaultAppBar'
import { SelectionAppBar } from './SelectionAppBar'

export const TagManagerAppBar = {
  Default: memo(DefaultAppBar),
  Selection: memo(SelectionAppBar),
}
