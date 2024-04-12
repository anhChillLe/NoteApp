import React, { ComponentProps, FC, useCallback, useState } from 'react'
import { ListRenderItem, StyleSheet } from 'react-native'
import Animated, {
  LinearTransition,
  ZoomOutLeft,
} from 'react-native-reanimated'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { Results } from 'realm'
import { TagItem } from '~/components/molecules'
import { TagManager, useInputActionSheet } from '~/components/organisms'
import { useQuery } from '~/services/database'
import { Note, Tag, Task } from '~/services/database/model'
import { queryByTag } from '~/services/database/query'

interface Props {
  tags: Results<Tag>
  onBackPress: () => void
  onTagPress: (tag: Tag) => void
  onNewTag: (title: string) => void
  onUpdateTag: (tag: Tag, newName: string) => void
  onPinTag: (...tags: Tag[]) => void
  onDeleteTag: (...tags: Tag[]) => void
}

export const TagManagerLayout: FC<Props> = ({
  tags,
  onNewTag,
  onUpdateTag,
  onPinTag,
  onBackPress,
  onDeleteTag,
  onTagPress,
}) => {
  const { bottom, top } = useSafeAreaInsets()
  const actionSheet = useInputActionSheet()
  const [selecteds, setSelecteds] = useState<Tag[]>([])
  const [isInSelect, setIsInSelect] = useState(false)
  const isAllChecked = selecteds.length === tags.length
  const isShowEdit = selecteds.length === 1

  const handleClose = useCallback(() => {
    setIsInSelect(false)
    setSelecteds([])
  }, [setIsInSelect, setSelecteds])

  const handleCheckAll = useCallback(() => {
    if (selecteds.length === tags.length) {
      setSelecteds([])
    } else {
      setSelecteds(tags.map(it => it))
    }
  }, [setSelecteds, selecteds, tags])

  console.log(selecteds.length)

  const showInput = useCallback(() => {
    actionSheet.current?.show()
  }, [actionSheet])

  const showInputForUpdate = useCallback(() => {
    actionSheet.current?.show(selecteds[0].name)
  }, [actionSheet, selecteds])

  const handleDeleteTags = useCallback(() => {
    setSelecteds(selectedTags => {
      onDeleteTag(...selectedTags)
      return []
    })
  }, [setSelecteds, onDeleteTag])

  const handleInputSubmit = useCallback(
    (text: string) => {
      isInSelect ? onUpdateTag(selecteds[0], text) : onNewTag(text)
    },
    [selecteds, isInSelect, onNewTag, onUpdateTag],
  )

  const handlePinTag = useCallback(() => {
    onPinTag(...selecteds)
  }, [selecteds, onPinTag])

  const renderTag = useCallback<ListRenderItem<Tag>>(
    ({ item }) => {
      const index = selecteds.findIndex(it => it.id === item.id)

      const selectTag = () => {
        setSelecteds(selecteds => {
          if (index === -1) {
            return [...selecteds, item]
          } else {
            selecteds.splice(index, 1)
            return [...selecteds]
          }
        })
      }

      const onPress = () => {
        if (isInSelect) selectTag()
        else onTagPress(item)
      }

      const onLongPress = () => {
        setIsInSelect(true)
        selectTag()
      }

      const isSelected = index !== -1

      return (
        <TagItemWithCount
          data={item}
          onPress={onPress}
          selectable={isInSelect}
          isSelected={isSelected}
          onLongPress={onLongPress}
          style={styles.item}
          exiting={ZoomOutLeft}
        />
      )
    },
    [onTagPress, setIsInSelect, selecteds, isInSelect],
  )

  return (
    <>
      <SafeAreaView style={styles.container} edges={['left', 'right', 'top']}>
        {isInSelect ? (
          <TagManager.AppBar.Selection
            onClosePress={handleClose}
            onCheckAllPress={handleCheckAll}
            isAllChecked={isAllChecked}
            count={selecteds.length}
          />
        ) : (
          <TagManager.AppBar.Default
            onBackPress={onBackPress}
            onNewTagPress={showInput}
          />
        )}
        <Animated.FlatList
          data={tags}
          renderItem={renderTag}
          itemLayoutAnimation={LinearTransition}
          keyExtractor={item => item.id}
          contentContainerStyle={[
            styles.tag_content_container,
            { paddingBottom: bottom },
          ]}
        />
        {isInSelect && (
          <TagManager.BottomMenuBar
            onDeletePress={handleDeleteTags}
            onPinPress={handlePinTag}
            onEditPress={showInputForUpdate}
            showEdit={isShowEdit}
            style={[styles.bottom_menu, { marginBottom: bottom }]}
          />
        )}
      </SafeAreaView>
      <TagManager.InputSheet
        title="Enter a tag name"
        ref={actionSheet}
        onSubmit={handleInputSubmit}
      />
    </>
  )
}

const TagItemWithCount: typeof TagItem = props => {
  const totalNote = useQuery(Note, notes =>
    queryByTag(notes, props.data),
  ).length
  const totalTask = useQuery(Task, tasks =>
    queryByTag(tasks, props.data),
  ).length
  return <TagItem totalNote={totalNote} totalTask={totalTask} {...props} />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
  },
  tag_content_container: {
    paddingHorizontal: 16,
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 8,
  },
  tag_column_wrapper: {
    gap: 8,
  },
  item: {
    flex: 1,
  },
  bottom_menu: {},
})
