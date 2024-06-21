import React, { FC, memo, useState } from 'react'
import { ListRenderItem, StyleSheet, View } from 'react-native'
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
  LayoutAnimationConfig,
  LinearTransition,
  ZoomOutLeft,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTagManager } from '~/components/Provider'
import { InputSheet, TagListItem } from '~/components/molecules'
import {
  ActionBar,
  Appbar,
  SelectionAppbar,
  TagListEmpty,
} from '~/components/organisms'
import { useVisible } from '~/hooks'
import { createTagItemWithCount } from '~/screens/TagManager/query'
import useTagMangeState from '~/screens/TagManager/store'
import { Tag } from '~/services/database/model'

const TagManagerScreenLayout: FC = () => {
  const isInSelectMode = useTagMangeState(state => state.mode === 'select')

  return (
    <LayoutAnimationConfig skipEntering>
      <View style={styles.container}>
        {isInSelectMode ? <TSelectionAppbar /> : <TAppbar />}
        <TContent />
        {isInSelectMode && <TActionBar />}
      </View>
    </LayoutAnimationConfig>
  )
}

const TSelectionAppbar = memo(
  () => {
    const insets = useSafeAreaInsets()
    const setMode = useTagMangeState(state => state.setMode)
    const setSelecteds = useTagMangeState(state => state.setSelecteds)
    const numOfItem = useTagMangeState(state => state.selecteds.length)
    const selecteds = useTagMangeState(state => state.selecteds)
    const tags = useTagManager(state => state.tags)

    const isAllChecked = selecteds.length === tags.length
    const checkAll = () => setSelecteds(isAllChecked ? [] : tags)
    const close = () => setMode('default')

    return (
      <SelectionAppbar
        entering={FadeInUp}
        exiting={FadeOutUp}
        onClosePress={close}
        onCheckAllPress={checkAll}
        numOfItem={numOfItem}
        style={{ paddingTop: insets.top }}
      />
    )
  },
  () => true,
)

const TAppbar: FC = memo(
  () => {
    const goBack = useTagManager(state => state.goBack)
    const createTag = useTagMangeState(state => state.createTag)
    const insets = useSafeAreaInsets()

    const [inputVisible, showInput, hideInput] = useVisible()
    const [inputText, setInputText] = useState('')

    const actions = [
      {
        icon: 'plus',
        visible: true as true,
        onPress: showInput,
      },
    ]

    return (
      <>
        <Appbar
          entering={FadeInUp}
          exiting={FadeOutUp}
          onBackPress={goBack}
          title="Tags"
          actions={actions}
          style={{ paddingTop: insets.top }}
        />
        <InputSheet
          title="Enter a tag name"
          onSubmit={createTag}
          visible={inputVisible}
          text={inputText}
          onChangeText={setInputText}
          onDismiss={hideInput}
          onRequestClose={hideInput}
        />
      </>
    )
  },
  () => true,
)

const TActionBar = memo(
  () => {
    const insets = useSafeAreaInsets()

    const pinTags = useTagMangeState(state => state.pinTags)
    const deleteTags = useTagMangeState(state => state.deleteTags)
    const renameTag = useTagMangeState(state => state.renameTag)
    const selecteds = useTagMangeState(state => state.selecteds)
    const [inputVisible, showInput, hideInput] = useVisible()
    const [inputText, setInputText] = useState('')

    const actions = [
      {
        icon: 'thumbtack',
        label: 'Pin',
        disable: selecteds.length === 0,
        onPress: pinTags,
      },
      {
        icon: 'trash',
        label: 'Delete',
        disable: selecteds.length === 0,
        onPress: deleteTags,
      },
      {
        icon: 'edit',
        label: 'Edit',
        disable: selecteds.length !== 1,
        onPress: () => {
          const item = selecteds[0]
          setInputText(item?.name)
          showInput()
        },
      },
    ]

    return (
      <>
        <ActionBar
          entering={FadeInDown}
          exiting={FadeOutDown}
          actions={actions}
          style={{ paddingBottom: insets.bottom }}
        />
        <InputSheet
          title="Enter a tag name"
          onSubmit={renameTag}
          visible={inputVisible}
          text={inputText}
          onChangeText={setInputText}
          onDismiss={hideInput}
          onRequestClose={hideInput}
        />
      </>
    )
  },
  () => true,
)

const ListItem = createTagItemWithCount(TagListItem)

const TContent = memo(
  () => {
    const tags = useTagManager(state => state.tags)
    const goBackWithTag = useTagManager(state => state.goBack)
    const { mode, select, selecteds } = useTagMangeState()

    const renderTag: ListRenderItem<Tag> = ({ item }) => {
      const isSelected = selecteds.some(it => it.id === item.id)

      const onPress = () => {
        if (mode === 'select') select(item)
        else goBackWithTag()
      }

      const onLongPress = () => {
        select(item)
      }

      return (
        <ListItem
          data={item}
          tagId={item.id}
          onPress={onPress}
          selectable={mode === 'select'}
          isSelected={isSelected}
          onLongPress={onLongPress}
          style={styles.item}
          exiting={ZoomOutLeft}
        />
      )
    }

    return (
      <Animated.FlatList
        data={tags}
        renderItem={renderTag}
        itemLayoutAnimation={LinearTransition}
        ListEmptyComponent={TagListEmpty}
        keyExtractor={item => item.id}
        style={styles.tag_list}
        contentContainerStyle={styles.tag_content_container}
      />
    )
  },
  () => true,
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
  },
  tag_list: {
    flex: 1,
  },
  tag_content_container: {
    flexGrow: 1,
    gap: 8,
    paddingHorizontal: 16,
  },
  item: {
    flex: 1,
  },
})

export default memo(TagManagerScreenLayout)
