import { memo } from 'react'
import { HomeActionBar } from './Actionbar'
import { HomeBottomAppbar } from './BottomAppbar'
import { HomeContentList } from './ContentList'
import { HomeHeader } from './Header'
import { HomeSelectionAppbar } from './SelectionAppbar'
import { HomeTagList } from './TagList'
import { HomeProvider, useHome } from './Provider'

export namespace Home {
  export const Header = memo(HomeHeader)
  export const TagList = memo(HomeTagList)
  export const SelectionAppbar = memo(HomeSelectionAppbar)
  export const ContentList = memo(HomeContentList)
  export const Actionbar = memo(HomeActionBar)
  export const BottomAppbar = memo(HomeBottomAppbar)
  export const Provider = HomeProvider
}

export { useHome }
