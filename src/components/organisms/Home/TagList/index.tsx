import { FlashList, FlashListProps, ListRenderItem } from '@shopify/flash-list'
import React, { FC, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { TagItem } from '~/components/molecules'
import { Tag } from '~/services/database/model'
import { useHome } from '../Provider'
import { DragableTagItem } from './DragableItem'
import { DragItem } from './DragItem'

type ListProps = Omit<FlashListProps<Tag>, 'renderItem'>

interface Props extends ListProps {
  currentTag?: Tag
  onTagPress: (tag?: Tag) => void
  onTagManagerPress: () => void
}

export const HomeTagList: FC<Props> = ({
  currentTag,
  onTagPress,
  onTagManagerPress,
  style,
  contentContainerStyle,
  ...props
}) => {
  const { currentTag: dragingTag, setCurrentTag: setDragingTag } = useHome()

  const Header = useCallback<FC>(
    () => (
      <TagItem
        label="All"
        isSelected={!currentTag}
        style={styles.header}
        onPress={() => onTagPress(undefined)}
      />
    ),
    [onTagPress, currentTag],
  )

  const Footer = useCallback<FC>(
    () => <TagItem label="Manager" icon="folder" onPress={onTagManagerPress} />,
    [onTagManagerPress],
  )

  const Empty = useCallback<FC>(
    () => (
      <TagItem
        icon="plus-small"
        label="Create tag"
        isSelected
        onPress={onTagManagerPress}
      />
    ),
    [onTagManagerPress],
  )

  const renderItem: ListRenderItem<Tag> = ({ item }) => {
    const { id, name, isPinned } = item
    const isCurrent = currentTag?.id === id
    const isDraging = dragingTag?.id === id
    const onPress = () => onTagPress(item)
    const onDragStart = () => setDragingTag(item)
    const onDragEnd = () => setDragingTag(undefined)
    return (
      <DragableTagItem
        key={id}
        label={name}
        style={styles.item}
        isDraging={isDraging}
        isPinned={isPinned}
        isSelected={isCurrent}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onPress={onPress}
      />
    )
  }

  const keyExtractor = (item: Tag, index: number) => item.id

  return (
    <View style={styles.container}>
      {!!dragingTag && (
        <DragItem label={dragingTag.name} style={styles.drag_item} />
      )}
      <FlashList
        horizontal
        showsHorizontalScrollIndicator={false}
        estimatedItemSize={92}
        contentContainerStyle={contentContainerStyle}
        keyExtractor={keyExtractor}
        ListEmptyComponent={Empty}
        ListHeaderComponent={Header}
        ListFooterComponent={Footer}
        renderItem={renderItem}
        {...props}
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
  contentContainer: {
    gap: 8,
  },
  drag_item: {
    zIndex: 1,
  },
  item: {
    marginRight: 8,
  },
})
