import { Tag } from 'note-app-database'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View, ViewProps } from 'react-native'
import {
  Portal,
  createDetectGestureItem,
  useDrag,
  useTheme,
} from 'react-native-chill-ui'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { OrderedCollection } from 'realm'
import { Haptick } from '~/services/haptick'
import TagItem from '../TagItem'

interface Props extends ViewProps {
  data: OrderedCollection<Tag>
  currentTagId: string | null
  onTagChange: (id: string | null) => void
  onManagePress?: () => void
  onTrashPress?: () => void
  dragable?: boolean
  limit?: number
}
/**
 * In android, scrollview not support overflow: visible, so you need to create a same item outside scrollview
 * Same with flatlist, plashlist
 */
const TagList: FC<Props> = ({
  data,
  currentTagId,
  onTagChange,
  onManagePress,
  onTrashPress,
  dragable = false,
  limit,
  style,
  ...props
}) => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { extras, setExtras } = useDrag<Tag>()

  const renderItem = (item: Tag) => {
    const { id, name, isPinned } = item
    const isCurrent = currentTagId === id
    const onPress = () => onTagChange(item.id)
    const isCurrentDrag = item.id === extras?.id

    if (dragable) {
      const onActive = () => {
        setExtras(item)
        Haptick.medium()
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
              icon="add-outline"
              label={t('create_tag')}
              onPress={onManagePress}
            />
          </View>
        ) : (
          <>
            <TagItem
              label={t('all')}
              isSelected={!currentTagId}
              style={styles.header}
              onPress={() => onTagChange(null)}
            />
            {data.slice(0, limit).map(renderItem)}
            <View style={styles.footer}>
              {onTrashPress && (
                <TagItem
                  label={t('trash')}
                  icon="trash-outline"
                  onPress={onTrashPress}
                />
              )}
              {onManagePress && (
                <TagItem
                  label={t('manager')}
                  icon="folder-outline"
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
