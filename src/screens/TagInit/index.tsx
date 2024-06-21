import { FC, useCallback } from 'react'
import useAppState from '~/app/store'
import { TagInitLayout } from '~/components/templates'

const TagSelectScreen: FC = () => {
  const setFirstOpen = useAppState(state => state.setFirstOpen)

  const skip = useCallback(() => {
    setFirstOpen(false)
  }, [setFirstOpen])

  const start = useCallback(() => {
    setFirstOpen(false)
  }, [setFirstOpen])

  return <TagInitLayout onSkip={skip} onStart={start} />
}

export default TagSelectScreen
