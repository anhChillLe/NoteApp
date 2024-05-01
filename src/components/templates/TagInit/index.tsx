import { FC, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TagItem } from '~/components/molecules'

type TagData = { name: string; isSelected: boolean }
interface Props {
  onSkip: () => void
  onSubmit: (tags: TagData[]) => void
}

export const TagInitLayout: FC<Props> = ({ onSubmit, onSkip }) => {
  const [tags, setTags] = useState(tagsEng)

  const handleItemPress = (item: TagData) => {
    item.isSelected = !item.isSelected
    setTags(tags => [...tags])
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appbar}>
        <Button
          icon="angle-small-right"
          onPress={onSkip}
          contentStyle={styles.skip}
        >
          {strings.skip}
        </Button>
      </View>

      <Animated.ScrollView contentContainerStyle={styles.tag_group}>
        <Animated.View style={styles.title_container}>
          <Text variant="headlineMedium" style={styles.title}>
            {strings.title}
          </Text>
          <Text variant="bodyLarge" style={styles.desc}>
            {strings.description}
          </Text>
          <Text variant="titleMedium" style={styles.helper}>
            {strings.helper}
          </Text>
        </Animated.View>

        {tags.map((tag, index) => {
          const { isSelected, name } = tag
          const onPress = () => handleItemPress(tag)
          return (
            <TagItem
              key={index}
              layout={LinearTransition}
              isSelected={isSelected}
              icon={isSelected ? 'check' : 'plus'}
              onPress={onPress}
              label={name}
            />
          )
        })}
      </Animated.ScrollView>
      <Button
        mode="contained"
        onPress={() => onSubmit(tags)}
        style={styles.action}
        labelStyle={styles.action_label}
        contentStyle={styles.action_content}
      >
        {strings.start}
      </Button>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
  },
  tag_group: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'stretch',
    paddingHorizontal: 16,
    gap: 8,
    flex: 1,
  },
  title_container: {
    gap: 8,
  },
  title: {
    fontWeight: 'bold',
  },
  helper: {
    opacity: 0.6,
  },
  desc: {
    opacity: 0.85,
  },
  action_content: {
    padding: 6,
  },
  action_label: {
    fontSize: 16,
  },
  action: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
  skip: {
    flexDirection: 'row-reverse',
  },
  appbar: {
    flexDirection: 'row-reverse',
  },
})

const strings = {
  skip: 'Skip',
  title: 'Create your own tag',
  description:
    'Kick start your note-taking journey by creating personalized tags. These tags will help you categorize and retrieve your notes with ease.',
  helper: 'Select any tag below or create them laster',
  start: 'Get start',
}

const tagsEng = [
  { name: 'Work', isSelected: true },
  { name: 'Family', isSelected: true },
  { name: 'Health', isSelected: true },
  { name: 'Goals', isSelected: false },
  { name: 'Study', isSelected: true },
  { name: 'Hobbies', isSelected: false },
  { name: 'Travel', isSelected: false },
  { name: 'Finance', isSelected: false },
  { name: 'Technology', isSelected: false },
  { name: 'Food', isSelected: false },
  { name: 'Books', isSelected: false },
  { name: 'Movies', isSelected: false },
  { name: 'Sports', isSelected: false },
  { name: 'Shopping', isSelected: false },
  { name: 'Important', isSelected: false },
]
