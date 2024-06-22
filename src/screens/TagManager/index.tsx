import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { FC, useCallback } from 'react'
import { BackHandler } from 'react-native'
import { TagManagerProvider } from '~/components/Provider'
import { TagManagerLayout } from '~/components/templates'
import { useQuery } from '~/services/database'
import { Tag } from '~/services/database/model'
import useTagMangeState from './store'
import useHomeState from '../Home/store'

const TagManagerScreen: FC = () => {
  const { goBack } = useNavigation()

  const isInSelectMode = useTagMangeState(state => state.mode === 'select')
  const setMode = useTagMangeState(state => state.setMode)

  const tags = useQuery({
    type: Tag,
    query: tags => tags.sorted('isPinned', true),
  })

  const goBackWithTag = useCallback(
    (tagId: string) => {
      useHomeState.getState().setCurrentTagId(tagId)
      goBack()
    },
    [goBack],
  )

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
    <TagManagerProvider value={{ goBack, goBackWithTag, tags }}>
      <TagManagerLayout />
    </TagManagerProvider>
  )
}

export default TagManagerScreen
