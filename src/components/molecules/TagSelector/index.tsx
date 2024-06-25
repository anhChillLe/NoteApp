import { FC, useRef, useState } from 'react'
import {
  Keyboard,
  TextInput as RNTextInput,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import { Button, useTheme } from 'react-native-paper'
import { useAnimatedRef } from 'react-native-reanimated'
import { List } from 'realm'
import { AnimatedPaper, AnimatedPressable } from '~/components/Animated'
import { Menu, RoundedTextInput } from '~/components/atoms'
import Shape from '~/components/atoms/Shape'
import { useVisible } from '~/hooks'
import { Tag } from '~/services/database/model'
import { Dialog, TagItem } from '..'

interface Props {
  currents: Tag[]
  tags: Tag[] | List<Tag>
  onChange: (tags: Tag[]) => void
  onNewTagSubmit?: (text: string) => void
  maxItems?: number
}

const TagSelector: FC<Props> = ({
  currents,
  tags,
  maxItems = 3,
  onNewTagSubmit,
  onChange,
}) => {
  const { colors, roundness } = useTheme()
  const input = useRef<RNTextInput>(null)
  const [text, setText] = useState('')
  const tagsRef = useAnimatedRef<View>()

  const isEmpty = currents.length === 0

  const [tagVisbile, showTags, hideTags] = useVisible(false)
  const [inputVisible, show, hide] = useVisible(false)

  const showInput = () => {
    show()
    input.current?.focus()
  }

  const hideInput = () => {
    hide()
    Keyboard.dismiss()
    setText('')
  }

  const handleSubmit = () => {
    onNewTagSubmit?.(text)
    hideInput()
  }

  const renderTag = (tag: Tag) => {
    const newTags = currents.filter(it => it.id !== tag.id)
    const isSelected = newTags.length !== currents.length
    const onPress = () => {
      if (!isSelected) onChange([...currents, tag])
      else onChange(newTags)
    }

    return (
      <TagItem
        key={tag.id}
        isSelected={isSelected}
        onPress={onPress}
        label={tag.name}
      />
    )
  }

  const containerStyle: ViewStyle = {
    borderRadius: roundness * 2,
    borderColor: colors.secondaryContainer,
  }

  return (
    <>
      <AnimatedPressable
        ref={tagsRef}
        onPress={showTags}
        style={[styles.item, containerStyle]}
      >
        {isEmpty && <AnimatedPaper.Icon source="plus-small" size={16} />}
        <AnimatedPaper.Text>
          {isEmpty ? 'Add tag' : getTagsString(currents, maxItems)}
        </AnimatedPaper.Text>
      </AnimatedPressable>
      <Menu
        visible={tagVisbile}
        onRequestClose={hideTags}
        anchorRef={tagsRef}
        style={styles.tag_menu}
      >
        <Shape style={styles.tag_container}>
          {tags.map(renderTag)}
          <TagItem icon="plus" label="New tag" onPress={showInput} />
        </Shape>
      </Menu>
      <Dialog
        visible={inputVisible}
        dismissable
        dismissableBackButton
        onRequestClose={hideInput}
        style={styles.dialog}
      >
        <Dialog.Title children="Create tag" />
        <Dialog.Content>
          <RoundedTextInput
            mode="outlined"
            value={text}
            onChangeText={setText}
            placeholder="Tag name"
            onSubmitEditing={handleSubmit}
            autoFocus
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button mode="contained" children="OK" onPress={handleSubmit} />
          <Button mode="outlined" children="Cancel" onPress={hideInput} />
        </Dialog.Actions>
      </Dialog>
    </>
  )
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    margin: 6,
  },
  tag_menu: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 20,
    gap: 16,
    alignItems: 'stretch',
  },
  tag_container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  dialog: {
    justifyContent: 'flex-end',
  },
})

const getTagsString = (tags: Tag[], maxItems: number) => {
  const isOver = tags.length > maxItems
  const str = tags
    .slice(0, maxItems)
    .map(it => it.name)
    .join(', ')
  return isOver ? str + `,...` : str
}

export default TagSelector
