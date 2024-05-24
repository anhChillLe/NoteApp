import { memo } from 'react'
import { HomeActionBar } from './Actionbar'
import { HomeBottomAppbar } from './BottomAppbar'
import { HomeContentList } from './ContentList'
import { HomeDragingTagProvider, useDragingHome } from './DargingTagProvider'
import { HomeHeader } from './Header'
import { HomePrivateActive } from './PrivateActive'
import { HomeProvider } from './Provider'
import { HomeTagList } from './TagList'
import { useHome } from './Provider'

export namespace Home {
  export const Header = memo(HomeHeader)
  export const TagList = memo(HomeTagList)
  export const ContentList = memo(HomeContentList)
  export const Actionbar = memo(HomeActionBar)
  export const BottomAppbar = memo(HomeBottomAppbar)
  export const DragingTagProvider = HomeDragingTagProvider
  export const Provider = HomeProvider
  export const PrivateActive = HomePrivateActive
}

export { useDragingHome }
export { useHome }
