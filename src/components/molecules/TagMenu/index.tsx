import { FC, useState } from 'react'
import { Keyboard, StyleSheet, View, ViewStyle } from 'react-native'
import { Button, TextInput, useTheme } from 'react-native-paper'
import { List } from 'realm'
import {
  ActionSheet,
  AnimatedPaper,
  useActionSheetRef,
} from '~/components/atoms'
import { AnimatedPressable } from '~/components/atoms/Animated'
import { Tag } from '~/services/database/model'
import { TagItem } from '..'

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
  const tagSheet = useActionSheetRef()
  const inputSheet = useActionSheetRef()

  const isEmpty = currents.length === 0

  const icon = isEmpty ? 'plus-small' : undefined

  const showTags = () => {
    Keyboard.dismiss()
    tagSheet.current.show()
  }
  const hideTags = () => {
    tagSheet.current.hide()
  }

  const showInput = () => {
    Keyboard.dismiss()
    tagSheet.current.hide(inputSheet.current.show)
  }

  const hideInput = () => {
    Keyboard.dismiss()
    inputSheet.current.hide()
  }

  const handleSubmit = () => {
    onNewTagSubmit?.(text)
    Keyboard.dismiss()
    inputSheet.current.hide(showTags)
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

  const sheetContaineStyle: ViewStyle = {
    backgroundColor: colors.background,
    borderRadius: roundness * 4,
  }

  const containerStyle: ViewStyle = {
    borderRadius: roundness * 2,
    borderColor: colors.secondaryContainer,
    borderWidth: 1,
  }

  return (
    <>
      <AnimatedPressable
        onPress={showTags}
        style={[styles.item, containerStyle]}
      >
        {!!icon && <AnimatedPaper.Icon source={icon} size={16} />}
        <AnimatedPaper.Text>
          {isEmpty ? 'Add tag' : getTagsString(currents, maxItems)}
        </AnimatedPaper.Text>
      </AnimatedPressable>
      <ActionSheet
        ref={tagSheet}
        dissmisable
        style={[sheetContaineStyle, styles.container]}
      >
        <View style={styles.tag_container}>
          {tags.map(renderTag)}
          <TagItem icon="plus" label="New tag" onPress={showInput} />
        </View>
        <View style={styles.action_container}>
          <Button mode="contained" style={styles.action} onPress={hideTags}>
            OK
          </Button>
        </View>
      </ActionSheet>
      <ActionSheet
        ref={inputSheet}
        dissmisable
        style={[sheetContaineStyle, styles.container]}
      >
        <AnimatedPaper.Text variant="titleLarge" children="Create tag" />
        <TextInput
          mode="outlined"
          placeholder="Enter tag title"
          autoFocus
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
          <Button mode="contained" style={styles.action} onPress={handleSubmit}>
            OK
          </Button>
        </View>
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
  },
  container: {
    margin: 8,
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
