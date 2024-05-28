import { FC, useState } from 'react'
import { Keyboard, StyleSheet, View, ViewStyle } from 'react-native'
import { Button, TextInput, useTheme } from 'react-native-paper'
import { List } from 'realm'
import { AnimatedPaper, AnimatedPressable } from '~/components/Animated'
import { ActionSheet, Menu } from '~/components/atoms'
import { useVisible } from '~/hooks'
import { Tag } from '~/services/database/model'
import { TagItem } from '..'
import Animated, { useAnimatedRef } from 'react-native-reanimated'

interface Props {
  currents: Tag[]
  tags: Tag[] | List<Tag>
  onChange: (tags: Tag[]) => void
  onNewTagSubmit?: (text: string) => void
  maxItems?: number
}

export const TagMenu: FC<Props> = ({
  currents,
  tags,
  maxItems = 3,
  onNewTagSubmit,
  onChange,
}) => {
  const { colors, roundness } = useTheme()
  const [text, setText] = useState('')
  const tagsRef = useAnimatedRef<View>()

  const isEmpty = currents.length === 0

  const icon = isEmpty ? 'plus-small' : undefined

  const [tagVisbile, showTags, hideTags] = useVisible(false)
  const [inputVisible, showInput, hideInput] = useVisible(false)

  const handleSubmit = () => {
    onNewTagSubmit?.(text)
    Keyboard.dismiss()
    hideInput()
    setText('')
  }

  const renderTag = (tag: Tag) => {
    const newTags = currents.filter(it => it.id !== tag.id)
    const isSelected = newTags.length !== currents.length
    const onPress = () => {
      if (!isSelected) onChange([...currents, tag])
      else onChange(newTags)
    }
    const icon = isSelected ? 'check' : undefined

    return (
      <TagItem
        key={tag.id}
        icon={icon}
        isSelected={isSelected}
        onPress={onPress}
        label={tag.name}
      />
    )
  }

  const shape: ViewStyle = {
    backgroundColor: colors.background,
    borderRadius: roundness * 4,
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
        {!!icon && <AnimatedPaper.Icon source={icon} size={16} />}
        <AnimatedPaper.Text>
          {isEmpty ? 'Add tag' : getTagsString(currents, maxItems)}
        </AnimatedPaper.Text>
      </AnimatedPressable>
      <Menu
        visible={tagVisbile}
        onDismiss={hideTags}
        anchorRef={tagsRef}
        style={[shape, styles.tag_menu]}
      >
        <View style={styles.tag_container}>
          {tags.map(renderTag)}
          <TagItem icon="plus" label="New tag" onPress={showInput} />
        </View>
      </Menu>
      <ActionSheet
        visible={inputVisible}
        onRequestClose={hideInput}
        onDismiss={hideInput}
      >
        <Animated.View style={[shape, styles.input_container]}>
          <AnimatedPaper.Text variant="titleLarge" children="Create tag" />
          <TextInput
            mode="outlined"
            placeholder="Enter tag title"
            value={text}
            onChangeText={setText}
          />
          <View style={styles.action_container}>
            <Button
              mode="contained-tonal"
              style={styles.action}
              onPress={hideInput}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              style={styles.action}
              onPress={handleSubmit}
            >
              OK
            </Button>
          </View>
        </Animated.View>
      </ActionSheet>
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
  },
  tag_menu: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 24,
    gap: 16,
    alignItems: 'stretch',
  },
  input_container: {
    marginHorizontal: 16,
    padding: 24,
    gap: 16,
    alignItems: 'stretch',
  },
  title: {
    textAlign: 'center',
    fontWeight: '600',
  },
  tag_container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  action_container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 8,
  },
  action: {
    flex: 1,
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
