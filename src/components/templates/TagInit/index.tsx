import { FC, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AnimatedPaper } from '~/components/atoms'

type TagData = { name: string; isSelected: boolean }
interface Props {
  onSkip: () => void
  onSubmit: (tags: TagData[]) => void
}

export const TagInitLayout: FC<Props> = ({ onSubmit, onSkip }) => {
  const [tags, setTags] = useState(tagsEng)
  return (
    <SafeAreaView style={styles.contentContainer}>
      <View style={{ flexDirection: 'row-reverse' }}>
        <Button
          icon="angle-small-right"
          onPress={onSkip}
          contentStyle={{ flexDirection: 'row-reverse' }}
        >
          {strings.skip}
        </Button>
      </View>
      <Animated.View style={styles.title_container} layout={transition}>
        <Text variant="headlineMedium" style={styles.title}>
          {strings.title}
        </Text>
        <Text variant="bodyLarge" style={styles.desc}>
          {strings.description}
        </Text>
      </Animated.View>
      <Text variant="titleMedium" style={styles.helper}>
        {strings.helper}
      </Text>
      <Animated.ScrollView contentContainerStyle={styles.tag_group}>
        {tags.map((tag, index) => {
          const { isSelected, name } = tag
          return (
            <AnimatedPaper.Button
              key={index}
              layout={transition}
              mode={isSelected ? 'contained' : 'contained-tonal'}
              icon={isSelected ? 'check' : undefined}
              onPress={e => {
                tag.isSelected = !tag.isSelected
                setTags(tags => [...tags])
              }}
            >
              {name}
            </AnimatedPaper.Button>
          )
        })}
      </Animated.ScrollView>
      <View style={styles.action_container}>
        <Button
          mode="contained"
          onPress={() => onSubmit(tags)}
          labelStyle={styles.action_label}
          contentStyle={styles.action_content}
        >
          {strings.start}
        </Button>
      </View>
    </SafeAreaView>
  )
}

const transition = LinearTransition.duration(100)

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    gap: 16,
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
    paddingHorizontal: 16,
    gap: 8,
  },
  title: {
    fontWeight: 'bold',
  },
  helper: {
    opacity: 0.6,
    paddingHorizontal: 16,
  },
  desc: {
    opacity: 0.85,
  },
  action_container: {
    paddingHorizontal: 24,
  },
  action_content: {
    padding: 6,
  },
  action_label: {
    fontSize: 16,
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
