import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { FC, useCallback } from 'react'
import { BackHandler } from 'react-native'
import { TagManagerProvider } from '~/components/Provider'
import { TagManagerLayout } from '~/components/templates'
import { useQuery } from '~/services/database'
import { Tag } from '~/services/database/model'
import useTagMangeState from './store'

const TagManagerScreen: FC = () => {
  const { goBack } = useNavigation()

  const isInSelectMode = useTagMangeState(state => state.mode === 'select')
  const setMode = useTagMangeState(state => state.setMode)

  const tags = useQuery({
    type: Tag,
    query: tags => tags.sorted('isPinned', true),
  })

  const backHandler = useCallback(() => {
    const handler = () => {
      isInSelectMode && setMode('default')
      return isInSelectMode
    }
    const listener = BackHandler.addEventListener('hardwareBackPress', handler)
    return listener.remove
  }, [isInSelectMode, setMode])

  useFocusEffect(backHandler)

  return (
    <TagManagerProvider value={{ goBack, tags }}>
      <TagManagerLayout />
    </TagManagerProvider>
  )
}

export default TagManagerScreen
