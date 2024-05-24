import { useFocusEffect } from '@react-navigation/native'
import React, { FC, useCallback, useRef, useState } from 'react'
import {
  BackHandler,
  ListRenderItem,
  StyleSheet,
  TextInput,
} from 'react-native'
import Animated, {
  LinearTransition,
  ZoomOutLeft,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Results } from 'realm'
import { TagItemFull } from '~/components/molecules'
import { TagManager } from '~/components/organisms'
import { useSelection, useVisible } from '~/hooks'
import { Tag } from '~/services/database/model'

interface Props {
  tags: Results<Tag>
  onBackPress: () => void
  onTagPress: (tag: Tag) => void
  onNewTag: (title: string) => void
  onUpdateTag: (tag: Tag, newName: string) => void
  onPinTag: (...tags: Tag[]) => void
  onDeleteTag: (...tags: Tag[]) => void
}

const compairTag = (t1: Tag, t2: Tag) => t1.id === t2.id

export const TagManagerLayout: FC<Props> = ({
  tags,
  onNewTag,
  onUpdateTag,
  onPinTag,
  onBackPress,
  onDeleteTag,
  onTagPress,
}) => {
  const [isInSelect, selecteds, controller] = useSelection(compairTag)

  const [inputVisible, showInput, hideInput] = useVisible()
  const [inputText, setInputText] = useState('')

  const isAllChecked = selecteds.length === tags.length

  const isShowEdit = selecteds.length === 1

  const isEmpty = tags.length === 0

  const handleCheckAll = useCallback(() => {
    if (selecteds.length === tags.length) {
      controller.set([])
    } else {
      controller.set(tags.map(it => it))
    }
  }, [controller, selecteds, tags])

  const showInputForUpdate = useCallback(() => {
    setInputText(selecteds[0]?.name)
    showInput()
  }, [setInputText, selecteds])

  const handleDeleteTags = useCallback(() => {
    onDeleteTag(...selecteds)
    controller.set([])
  }, [controller, onDeleteTag, selecteds])

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

      const isSelected = index !== -1

      const onPress = () => {
        if (isInSelect) controller.select(item)
        else onTagPress(item)
      }

      const onLongPress = () => {
        controller.enable()
        controller.select(item)
      }

      return (
        <TagItemFull
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
    [onTagPress, controller, selecteds, isInSelect],
  )

  useFocusEffect(() => {
    const handler = () => {
      isInSelect && controller.disable()
      return isInSelect
    }
    const listener = BackHandler.addEventListener('hardwareBackPress', handler)
    return listener.remove
  })

  return (
    <>
      <SafeAreaView style={styles.container}>
        {isInSelect ? (
          <TagManager.SelectionAppbar
            onClosePress={controller.disable}
            onCheckAllPress={handleCheckAll}
            isAllChecked={isAllChecked}
            count={selecteds.length}
          />
        ) : (
          <TagManager.DefaultAppbar
            onBackPress={onBackPress}
            onNewTagPress={showInput}
          />
        )}
        <Animated.FlatList
          data={tags}
          renderItem={renderTag}
          itemLayoutAnimation={LinearTransition}
          ListEmptyComponent={<TagManager.Empty onNewTagPress={showInput} />}
          keyExtractor={item => item.id}
          style={styles.tag_list}
          contentContainerStyle={[
            styles.tag_content_container,
            isEmpty && { flexGrow: 1 },
          ]}
        />
        {isInSelect && (
          <TagManager.BottomMenubar
            onDeletePress={handleDeleteTags}
            onPinPress={handlePinTag}
            onEditPress={showInputForUpdate}
            showEdit={isShowEdit}
            style={styles.bottom_menu}
          />
        )}
      </SafeAreaView>
      <TagManager.InputSheet
        title="Enter a tag name"
        onSubmit={handleInputSubmit}
        visible={inputVisible}
        text={inputText}
        onChangeText={setInputText}
        onDismiss={hideInput}
        onRequestClose={hideInput}
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
  },
  tag_list: {
    flex: 1,
  },
  tag_content_container: {
    gap: 8,
    paddingHorizontal: 16,
  },
  tag_column_wrapper: {
    gap: 8,
  },
  item: {
    flex: 1,
  },
  bottom_menu: {},
})
