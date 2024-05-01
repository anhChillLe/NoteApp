import {
  MasonryFlashList,
  MasonryFlashListProps,
  MasonryListRenderItem,
} from '@shopify/flash-list'
import React, { FC, useMemo, useState } from 'react'
import { LayoutChangeEvent, ViewStyle } from 'react-native'
import { trigger } from 'react-native-haptic-feedback'
import { Note, Tag, TaskItem } from '~/services/database/model'
import { useHome } from '../Provider'
import { AnimatedCell } from './AnimatedCell'
import { HomeEmpty } from './Empty'
import { DetectTagNoteListItem } from './Item'

type ListProps = Omit<MasonryFlashListProps<Note>, 'renderItem'>

type RenderItem = MasonryListRenderItem<Note>

interface Props extends ListProps {
  isInSelect?: boolean
  selecteds?: Note[]
  space?: number
  onItemSelect: (item: Note) => void
  onItemPress: (item: Note) => void
  onItemLongPress: (item: Note) => void
  onTaskItemPress: (item: TaskItem) => void
  onTagToItem: (tag: Tag, item: Note) => void
}

export const HomeContentList: FC<Props> = ({
  data,
  numColumns = 2,
  space = 8,
  isInSelect,
  selecteds = [],
  onItemPress,
  onItemSelect,
  onItemLongPress,
  onTaskItemPress,
  onTagToItem,
  ...props
}) => {
  const { currentTag } = useHome()
  const [height, setHeight] = useState(0)

  const extraData = useMemo(() => {
    return []
  }, [currentTag, selecteds])

  const ListEmpty: FC = () => <HomeEmpty style={{ height }} />

  const onLayout = (e: LayoutChangeEvent) => {
    setHeight(e.nativeEvent.layout.height)
  }

  const renderItem: RenderItem = ({ item, columnIndex, index }) => {
    const style: ViewStyle = {
      marginEnd: columnIndex !== numColumns - 1 ? space : 0,
      marginTop: index < numColumns ? 0 : space,
    }

    const onPress = () => {
      if (isInSelect) {
        trigger('effectTick')
        onItemSelect(item)
      } else onItemPress(item)
    }

    const onLongPress = () => {
      trigger('effectTick')
      onItemLongPress(item)
    }

    const onDragIn = () => {
      if (currentTag !== undefined) {
        onTagToItem(currentTag, item)
      }
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
        onTaskItemPress={onTaskItemPress}
        onDragIn={onDragIn}
      />
    )
  }

  return (
    <MasonryFlashList
      data={data}
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
