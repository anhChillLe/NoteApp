import React, { FC, useMemo } from 'react'
import { ListRenderItem, StyleSheet } from 'react-native'
import { trigger } from 'react-native-haptic-feedback'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { Note } from '~/services/database/model'
import { useHomeSelect } from '~/store/home'
import { useDragingHome } from '../DargingTagProvider'
import { useHome } from '../Provider'
import { HomeEmpty } from './Empty'
import { DetectTagNoteListItem } from './Item'

type AnimatedFlatListProps<T> = React.ComponentProps<
  typeof Animated.FlatList<T>
>

type ListProps = Omit<AnimatedFlatListProps<Note>, 'renderItem' | 'data'>

type RenderItem = ListRenderItem<Note>

interface Props extends ListProps {}

export const HomeContentList: FC<Props> = ({
  contentContainerStyle,
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

  const extraData = useMemo(() => [], [dragingTag, selecteds])

  const renderItem: RenderItem = ({ item }) => {
    const onPress = () => {
      if (isInSelectMode) select(item)
      else openEditor(item)
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
    <Animated.FlatList
      data={notes}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      extraData={extraData}
      contentContainerStyle={contentContainerStyle}
      ListEmptyComponent={ListEmptyComponent}
      itemLayoutAnimation={LinearTransition}
      overScrollMode="never"
      bounces={false}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  empty: {
    flex: 1,
  },
})

const keyExtractor = (item: Note, index: number) => item.id

const ListEmptyComponent: FC = () => <HomeEmpty style={styles.empty} />
