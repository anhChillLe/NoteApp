import { FlashList, FlashListProps, ListRenderItem } from '@shopify/flash-list'
import React, { FC, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { TagItem } from '~/components/molecules'
import { Tag } from '~/services/database/model'
import { useDragingHome } from '../DargingTagProvider'
import { DragItem } from './DragItem'
import { DragableTagItem } from './DragableItem'
import { useHome } from '../Provider'

type ListProps = Omit<FlashListProps<Tag>, 'renderItem' | 'data'>

interface Props extends ListProps {}

export const HomeTagList: FC<Props> = ({
  style,
  contentContainerStyle,
  ...props
}) => {
  const { dragingTag, setDragingTag } = useDragingHome()
  const tags = useHome(state => state.tags)
  const currentTag = useHome(state => state.currentTag)
  const changeCurrentTag = useHome(state => state.changeCurrentTag)

  const renderItem: ListRenderItem<Tag> = ({ item }) => {
    const { id, name, isPinned } = item
    const isCurrent = currentTag?.id === id
    const onPress = () => changeCurrentTag(item)
    const onDragStart = () => setDragingTag(item)
    const onDragEnd = () => setDragingTag(undefined)
    return (
      <DragableTagItem
        key={id}
        label={name}
        style={styles.item}
        isPinned={isPinned}
        isSelected={isCurrent}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onPress={onPress}
      />
    )
  }

  return (
    <View style={styles.container}>
      {!!dragingTag && (
        <DragItem
          label={dragingTag.name}
          style={styles.drag_item}
          isPinned={dragingTag.isPinned}
          isSelected={currentTag?.id === dragingTag.id}
        />
      )}
      <FlashList
        data={tags}
        horizontal
        showsHorizontalScrollIndicator={false}
        estimatedItemSize={92}
        contentContainerStyle={contentContainerStyle}
        keyExtractor={keyExtractor}
        extraData={currentTag}
        ListEmptyComponent={Empty}
        ListHeaderComponent={Header}
        ListFooterComponent={Footer}
        renderItem={renderItem}
        {...props}
      />
    </View>
  )
}

const keyExtractor = (item: Tag, index: number) => item.id

const Header: FC = () => {
  const tags = useHome(state => state.tags)
  const currentTag = useHome(state => state.currentTag)
  const changeCurrentTag = useHome(state => state.changeCurrentTag)
  if (tags.isEmpty()) return null
  else
    return (
      <TagItem
        label="All"
        isSelected={!currentTag}
        style={styles.header}
        onPress={() => changeCurrentTag(null)}
      />
    )
}
const Footer: FC = () => {
  const openTagManager = useHome(state => state.openTagManager)
  const openDeletedNote = useHome(state => state.openDeletedNote)
  const openHidedNote = useHome(state => state.openHidedNote)
  return (
    <View style={styles.footer}>
      <TagItem label="Hided" icon="eye" onPress={openHidedNote} />
      <TagItem label="Trash" icon="trash" onPress={openDeletedNote} />
      <TagItem label="Manager" icon="folder" onPress={openTagManager} />
    </View>
  )
}

const Empty: FC = () => {
  const openTagManager = useHome(state => state.openTagManager)
  return (
    <View style={styles.empty}>
      <TagItem
        icon="plus-small"
        label="Create tag"
        isSelected
        onPress={openTagManager}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    overflow: 'visible',
    zIndex: 1,
  },
  header: {
    marginEnd: 8,
  },
  footer: {
    flexDirection: 'row',
    gap: 8,
  },
  contentContainer: {
    gap: 8,
  },
  drag_item: {
    zIndex: 1,
  },
  item: {
    marginRight: 8,
  },
  empty: {
    alignItems: 'flex-start',
    marginEnd: 8,
  },
})
