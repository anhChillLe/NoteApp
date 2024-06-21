import { FC, memo } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Button, HelperText, Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LargeButton } from '~/components/atoms'
import { TagItem } from '~/components/molecules'
import useTagInit from '~/screens/TagInit/store'

type TagData = { name: string; isSelected: boolean }
interface Props {
  onSkip: () => void
  onStart: () => void
}

const TagInitLayout: FC<Props> = ({ onSkip, onStart }) => {
  const { data, createTags, toggleItem } = useTagInit()

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

      <ScrollView contentContainerStyle={styles.tag_group}>
        <View style={styles.title_container}>
          <Text variant="headlineMedium" style={styles.title}>
            {strings.title}
          </Text>
          <Text variant="bodyLarge" style={styles.desc}>
            {strings.description}
          </Text>
          <HelperText type="info" padding="none">
            {strings.helper}
          </HelperText>
        </View>

        {data.map((tag, index) => {
          const { isSelected, name } = tag
          const onPress = () => toggleItem(index)
          return (
            <TagItem
              key={index}
              isSelected={isSelected}
              icon={isSelected ? 'check' : 'plus'}
              onPress={onPress}
              label={name}
            />
          )
        })}
      </ScrollView>
      <LargeButton
        mode="contained"
        onPress={() => {
          createTags()
          onStart()
        }}
        style={styles.action}
        children={strings.start}
      />
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
  title: 'Select your own tags',
  description:
    'Kick start your note-taking journey by creating personalized tags. These tags will help you categorize and retrieve your notes with ease.',
  helper: 'Select any tag below or create them laster',
  start: 'Get start',
}

export default memo(TagInitLayout)
