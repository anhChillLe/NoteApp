import React, { FC } from 'react'
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'
import { OrderedCollection } from 'realm'
import { TagItem } from '~/components/molecules'
import { Tag } from '~/services/database/model'
import { useHome } from '../Provider'
import { DragableTagItem } from './DragableItem'

export type HomeTagListData = {
  tags: Tag[] | OrderedCollection<Tag>
  tag?: Tag
  onTagPress: (tag?: Tag) => void
  onTagManagerPress: () => void
}

type Props = ViewProps &
  HomeTagListData & {
    contentContainerStyle?: StyleProp<ViewStyle>
  }

export const HomeTagList: FC<Props> = ({
  tags,
  tag: currentTag,
  onTagPress,
  onTagManagerPress,
  contentContainerStyle,
  ...props
}) => {
  const isEmpty = tags.length === 0
  const { currentTag: dragingTag, setCurrentTag: setDragingTag } = useHome()

  return (
    <View {...props}>
      <ScrollView
        horizontal
        style={styles.container}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      >
        {isEmpty ? (
          <TagItem
            icon="plus-small"
            label="Create tag"
            isSelected
            onPress={onTagManagerPress}
          />
        ) : (
          <>
            <TagItem
              label="All"
              isSelected={!currentTag}
              onPress={() => onTagPress(undefined)}
            />

            {tags.map(tag => {
              const isCurrent = currentTag ? tag.id === currentTag.id : false
              const onPress = () => onTagPress(tag)
              const isDraging = dragingTag?.id === tag.id
              const onDragStart = () => {
                setDragingTag(tag)
              }
              return (
                <DragableTagItem
                  key={tag.id}
                  label={tag.name}
                  style={styles.item}
                  isDraging={isDraging}
                  onDragStart={onDragStart}
                  isPinned={tag.isPinned}
                  isSelected={isCurrent}
                  onPress={onPress}
                />
              )
            })}

            <TagItem
              label="Manager"
              icon="folder"
              onPress={onTagManagerPress}
            />
          </>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'visible',
  },
  contentContainer: {
    gap: 8,
  },
  item: {
    zIndex: 1,
  },
})
