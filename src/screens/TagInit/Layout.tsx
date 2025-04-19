import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Button, Text } from 'react-native-chill-ui'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TagItem } from '~/components'

interface Props {
  data: string[]
  selecteds: Set<number>
  onItemPress: (item: string, index: number) => void
  onSkip: () => void
  onSubmit: () => void
}

const TagInitLayout: FC<Props> = ({
  data,
  selecteds,
  onSubmit,
  onItemPress,
  onSkip,
}) => {
  const { t } = useTranslation()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appbar}>
        <Button onPress={onSkip}>
          <Button.Text children={t('skip')} />
          <Button.Icon name="chevron-forward-outline" />
        </Button>
      </View>

      <ScrollView contentContainerStyle={styles.tag_group}>
        <View style={styles.title_container}>
          <Text
            variant="headlineMedium"
            style={styles.title}
            children={t('tag_init.title')}
          />
          <Text
            variant="bodyLarge"
            style={styles.desc}
            children={t('tag_init.description')}
          />
          <Text variant="bodySmall" children={t('tag_init.helper')} />
        </View>

        {data.map((name, index) => {
          const isSelected = selecteds.has(index)
          const onPress = () => onItemPress(name, index)
          return (
            <TagItem
              key={index}
              isSelected={isSelected}
              icon={isSelected ? 'checkmark' : 'add'}
              onPress={onPress}
              label={name}
            />
          )
        })}
      </ScrollView>
      <Button
        mode="contained"
        size="large"
        onPress={onSubmit}
        style={styles.action}
        title={t('get_start')}
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
  appbar: {
    flexDirection: 'row-reverse',
  },
})

export default TagInitLayout
