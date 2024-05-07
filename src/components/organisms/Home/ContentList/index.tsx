import {
  MasonryFlashList,
  MasonryFlashListProps,
  MasonryListRenderItem,
} from '@shopify/flash-list'
import React, { FC, useMemo, useState } from 'react'
import { LayoutChangeEvent, ViewStyle } from 'react-native'
import { trigger } from 'react-native-haptic-feedback'
import { Note } from '~/services/database/model'
import { useDragingHome } from '../DargingTagProvider'
import { useHome } from '../Provider'
import { AnimatedCell } from './AnimatedCell'
import { HomeEmpty } from './Empty'
import { DetectTagNoteListItem } from './Item'

type ListProps = Omit<MasonryFlashListProps<Note>, 'renderItem' | 'data'>

type RenderItem = MasonryListRenderItem<Note>

interface Props extends ListProps {
  isInSelect?: boolean
  selecteds?: Note[]
  space?: number
  onItemSelect: (item: Note) => void
  onItemLongPress: (item: Note) => void
}

export const HomeContentList: FC<Props> = ({
  numColumns = 2,
  space = 8,
  isInSelect,
  selecteds = [],
  onItemSelect,
  onItemLongPress,
  ...props
}) => {
  const { dragingTag } = useDragingHome()
  const [height, setHeight] = useState(0)

  const extraData = useMemo(() => [], [dragingTag, selecteds])

  const ListEmpty: FC = () => <HomeEmpty style={{ height }} />

  const onLayout = (e: LayoutChangeEvent) => {
    setHeight(e.nativeEvent.layout.height)
  }

  const notes = useHome(state => state.notes)
  const openEditor = useHome(state => state.openEditor)
  const changeTaskItemStatus = useHome(state => state.changeTaskItemStatus)
  const addTagToNote = useHome(state => state.addTagToNote)

  const renderItem: RenderItem = ({ item, columnIndex, index }) => {
    const style: ViewStyle = {
      marginEnd: columnIndex !== numColumns - 1 ? space : 0,
      marginTop: index < numColumns ? 0 : space,
    }

    const onPress = () => {
      if (isInSelect) {
        trigger('effectTick')
        onItemSelect(item)
      } else openEditor(item)
    }

    const onLongPress = () => {
      trigger('effectTick')
      onItemLongPress(item)
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
        selectable={isInSelect}
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
    <MasonryFlashList
      data={notes}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onLayout={onLayout}
      estimatedItemSize={131}
      numColumns={numColumns}
      extraData={extraData}
      CellRendererComponent={AnimatedCell}
      ListEmptyComponent={ListEmpty}
      {...props}
    />
  )
}

const keyExtractor = (item: Note, index: number) => item.id
