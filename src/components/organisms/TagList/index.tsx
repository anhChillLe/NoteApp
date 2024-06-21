import React, { FC } from 'react'
import { ScrollView, StyleSheet, View, ViewProps } from 'react-native'
import { trigger } from 'react-native-haptic-feedback'
import { Portal, useTheme } from 'react-native-paper'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { OrderedCollection } from 'realm'
import { createDetectGestureItem, useDrag } from '~/components/Provider'
import { TagItem } from '~/components/molecules'
import { Tag } from '~/services/database/model'

interface Props extends ViewProps {
  data: OrderedCollection<Tag>
  currentTagId: string | null
  onTagChange: (id: string | null) => void
  onManagePress?: () => void
  onTrashPress?: () => void
  dragable?: boolean
}

const TagList: FC<Props> = ({
  data,
  currentTagId,
  onTagChange,
  onManagePress,
  onTrashPress,
  dragable = false,
  style,
  ...props
}) => {
  const { colors } = useTheme()
  const { extras, setExtras } = useDrag<Tag>()

  const renderItem = (item: Tag, index: number) => {
    const { id, name, isPinned } = item
    const isCurrent = currentTagId === id
    const onPress = () => onTagChange(item.id)
    const isCurrentDrag = item.id === extras?.id

    if (dragable) {
      const onActive = () => {
        setExtras(item)
        trigger('effectTick')
      }
      const onInactive = () => {
        setExtras(null)
      }
      const style = [styles.item, { opacity: isCurrentDrag ? 0.35 : 1 }]

      return (
        <DetectGesuteTagItem
          key={id}
          label={name}
          style={style}
          isPinned={isPinned}
          isSelected={isCurrent}
          onPress={onPress}
          onActiveDrag={onActive}
          onInactiveDrag={onInactive}
        />
      )
    } else {
      return (
        <TagItem
          key={id}
          label={name}
          style={styles.item}
          isPinned={isPinned}
          isSelected={isCurrent}
          onPress={onPress}
        />
      )
    }
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background }, style]}
      {...props}
    >
      <DragItem />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.isEmpty() ? (
          <View style={styles.empty}>
            <TagItem
              icon="plus-small"
              label="Create tag"
              isSelected
              onPress={onManagePress}
            />
          </View>
        ) : (
          <>
            <TagItem
              label="All"
              isSelected={!currentTagId}
              style={styles.header}
              onPress={() => onTagChange(null)}
            />
            {data.map(renderItem)}
            <View style={styles.footer}>
              {onTrashPress && (
                <TagItem label="Trash" icon="trash" onPress={onTrashPress} />
              )}
              {onManagePress && (
                <TagItem
                  label="Manager"
                  icon="folder"
                  onPress={onManagePress}
                />
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  )
}

const DetectGesuteTagItem = createDetectGestureItem(TagItem)

const DragItem: FC = () => {
  const { extras: item, position, target } = useDrag<Tag>()

  const itemStyle = useAnimatedStyle(() => {
    const { translationX = 0, translationY = 0 } = position.value || {}

    return {
      opacity: target.value ? 1 : 0,
      top: target.value?.pageY,
      left: target.value?.pageX,
      transform: [{ translateX: translationX }, { translateY: translationY }],
    }
  })

  return (
    <Portal>
      {item && (
        <Animated.View style={styles.drag_item_container}>
          <TagItem
            key={item.id}
            label={item.name}
            style={itemStyle}
            selectable={false}
          />
        </Animated.View>
      )}
    </Portal>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'visible',
    flexDirection: 'row',
  },
  header: {
    marginEnd: 8,
  },
  footer: {
    flexDirection: 'row',
    gap: 8,
  },
  item: {
    marginRight: 8,
  },
  empty: {
    alignItems: 'flex-start',
    marginEnd: 8,
  },
  drag_item_container: {
    alignItems: 'flex-start',
  },
})

export default TagList
