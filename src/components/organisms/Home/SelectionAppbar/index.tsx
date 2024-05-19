import { FC, useCallback } from 'react'
import { ViewProps } from 'react-native'
import { AnimatedProps } from 'react-native-reanimated'
import { useHomeSelect } from '~/store/home'
import { SelectionAppbar } from '../../SelectionAppbar'
import { useHome } from '../Provider'

interface Props extends AnimatedProps<ViewProps> {}

export const HomeSelectionAppbar: FC<Props> = ({ style, ...props }) => {
  const notes = useHome(state => state.notes)
  const { selecteds, disable, set } = useHomeSelect()
  const numOfItem = useHomeSelect(state => state.selecteds.length)

  const checkAll = useCallback(() => {
    const isAllChecked = selecteds.length === notes.length
    set(isAllChecked ? [] : notes.map(it => it))
  }, [set, notes, selecteds])

  return (
    <SelectionAppbar
      onClosePress={disable}
      onCheckAllPress={checkAll}
      numOfItem={numOfItem}
      {...props}
    />
  )
}
