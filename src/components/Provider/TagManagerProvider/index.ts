import { OrderedCollection } from 'realm'
import { Tag } from '~/services/database/model'
import {
  ContextSelector,
  createContext,
  useContextSelector,
} from '../ContextSelector'

interface TagManagerScreenData {
  tags: OrderedCollection<Tag>
  goBack: () => void
  goBackWithTag: (tagId: string) => void
}

const TagManagerContext = createContext<TagManagerScreenData>()

const TagManagerProvider = TagManagerContext.Provider

const useTagManager = <T>(selector: ContextSelector<TagManagerScreenData, T>) =>
  useContextSelector(TagManagerContext, selector)

export { TagManagerProvider, useTagManager }
