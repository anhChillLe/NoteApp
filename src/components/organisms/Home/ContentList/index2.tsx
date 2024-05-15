import {
  MasonryFlashList,
  MasonryFlashListProps,
  MasonryListRenderItem,
} from '@shopify/flash-list'
import React, { FC, useMemo, useState } from 'react'
import { LayoutChangeEvent, ViewStyle } from 'react-native'
import { trigger } from 'react-native-haptic-feedback'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { Note } from '~/services/database/model'
import { useHomeSelect } from '~/store/home'
import { useDragingHome } from '../DargingTagProvider'
import { useHome } from '../Provider'
import { HomeEmpty } from './Empty'
import { DetectTagNoteListItem } from './Item'

type ListProps = Omit<MasonryFlashListProps<Note>, 'renderItem' | 'data'>

type RenderItem = MasonryListRenderItem<Note>

interface Props extends ListProps {
  space?: number
}

export const HomeContentList: FC<Props> = ({
  numColumns = 2,
  space = 8,
  style,
  ...props
}) => {
  const { dragingTag } = useDragingHome()

  const notes = useHome(state => state.notes)
  const openEditor = useHome(state => state.openEditor)
  const changeTaskItemStatus = useHome(state => state.changeTaskItemStatus)
  const addTagToNote = useHome(state => state.addTagToNote)

  const isInSelectMode = useHomeSelect(state => state.isInSelectMode)
  const selecteds = useHomeSelect(state => state.selecteds)
  const select = useHomeSelect(state => state.select)

  const [height, setHeight] = useState(0)

  const extraData = useMemo(() => [], [dragingTag, selecteds])

  const ListEmpty: FC = () => <HomeEmpty style={{ height }} />

  const handleLayout = (e: LayoutChangeEvent) => {
    setHeight(e.nativeEvent.layout.height)
  }

  const renderItem: RenderItem = ({ item, columnIndex, index }) => {
    const style: ViewStyle = {
      marginEnd: columnIndex !== numColumns - 1 ? space : 0,
      marginTop: index < numColumns ? 0 : space,
    }

    const onPress = () => {
      if (isInSelectMode) {
        trigger('effectTick')
        select(item)
      } else openEditor(item)
    }

    const onLongPress = () => {
      trigger('effectTick')
      select(item)
    }

    const onDragIn = () => {
      dragingTag && addTagToNote(item, dragingTag)
    }

    const isSelected = selecteds.some(it => it.id === item.id)

    return (
      <DetectTagNoteListItem
        data={item}
        style={style}
        isSelected={isSelected}
        selectable={isInSelectMode}
        maxLineOfContent={6}
        maxLineOfTitle={1}
        onPress={onPress}
        onLongPress={onLongPress}
        onTaskItemPress={changeTaskItemStatus}
        onDragIn={onDragIn}
      />
    )
  }

  return (
    <Animated.View style={style} layout={LinearTransition}>
      <MasonryFlashList
        data={notes}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onLayout={handleLayout}
        estimatedItemSize={131}
        numColumns={numColumns}
        extraData={extraData}
        ListEmptyComponent={ListEmpty}
        bounces
        {...props}
      />
    </Animated.View>
  )
}

const keyExtractor = (item: Note, index: number) => item.id
