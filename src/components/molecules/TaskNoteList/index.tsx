import {
  MasonryFlashList,
  MasonryFlashListProps,
  MasonryListRenderItem,
} from '@shopify/flash-list'
import React, { FC } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { NoteListItem, TaskListItem } from '~/components/molecules'
import { Note, Task, TaskItem } from '~/services/database/model'

interface Props extends Omit<MasonryFlashListProps<Task | Note>, 'renderItem'> {
  onItemPress: (item: Task | Note) => void
  onTaskItemPress: (item: TaskItem) => void
  itemStyle?: StyleProp<ViewStyle>
}

export const TaskNoteList: FC<Props> = ({
  onItemPress,
  onTaskItemPress,
  itemStyle,
  ...props
}) => {
  const getItemType = (item: Task | Note) => {
    if (item instanceof Note) {
      return 'Note'
    } else if (item instanceof Task) {
      return 'Task'
    } else {
      return undefined
    }
  }

  const renderItem: MasonryListRenderItem<Task | Note> = ({
    item,
    columnIndex,
    index,
  }) => {
    const style = {
      marginEnd: columnIndex !== (props.numColumns ?? 2) - 1 ? 8 : 0,
      marginBottom: index === (props.data?.length ?? 0) - 1 ? 0 : 8,
    }

    const onPress = () => {
      onItemPress(item)
    }

    if (item instanceof Note) {
      return (
        <NoteListItem
          key={index}
          data={item}
          style={[style, itemStyle]}
          onPress={onPress}
          maxLineOfContent={6}
          maxLineOfTitle={2}
        />
      )
    } else {
      return (
        <TaskListItem
          key={index}
          data={item}
          style={[style, itemStyle]}
          onPress={onPress}
          onTaskItemPress={onTaskItemPress}
        />
      )
    }
  }
  return (
    <MasonryFlashList
      getItemType={getItemType}
      estimatedItemSize={108}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      {...props}
    />
  )
}
