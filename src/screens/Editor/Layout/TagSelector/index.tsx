import { Tag } from 'note-app-database'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { Menu, useTheme } from 'react-native-chill-ui'
import { useAnimatedRef } from 'react-native-reanimated'
import { OrderedCollection } from 'realm'
import { AnimatedIcon, AnimatedPressable, AnimatedText } from '~/components'
import { useVisible } from '~/hooks'
import TagItem from '../../../../components/TagItem'

interface Props {
  currents: Tag[]
  tags: Tag[] | OrderedCollection<Tag>
  onChange: (tags: Tag[]) => void
  onNewTagPress?: () => void
  maxItems?: number
  label_empty: string
}

const TagSelector: FC<Props> = ({
  currents,
  tags,
  label_empty,
  maxItems = 3,
  onNewTagPress,
  onChange,
}) => {
  const { t } = useTranslation()
  const { colors, roundness } = useTheme()
  const tagsRef = useAnimatedRef<View>()

  const isEmpty = currents.length === 0

  const [tagVisbile, showTags, hideTags] = useVisible(false)

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
        accessibilityLabel={t('select_tag')}
      >
        {isEmpty && <AnimatedIcon name="add-outline" size={16} />}
        <AnimatedText
          children={isEmpty ? label_empty : getTagsString(currents, maxItems)}
        />
      </AnimatedPressable>
      <Menu
        visible={tagVisbile}
        onRequestClose={hideTags}
        anchorRef={tagsRef}
        style={styles.tag_menu}
      >
        <View style={styles.tag_container}>
          {tags.map(renderTag)}
          <TagItem
            icon="add-outline"
            label={t('create_tag')}
            onPress={onNewTagPress}
          />
        </View>
      </Menu>
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
