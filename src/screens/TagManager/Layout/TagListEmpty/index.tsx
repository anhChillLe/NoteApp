import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewProps } from 'react-native'
import { Text } from 'react-native-chill-ui'
import { StorySet } from '~/assets/storyset'

interface Props extends ViewProps {}

const TagListEmpty: FC<Props> = ({ style, ...props }) => {
  const { t } = useTranslation()

  return (
    <View style={[styles.container, style]} {...props}>
      <View>
        <StorySet.TagEmpty style={styles.icon} />
      </View>
      <View style={styles.content_container}>
        <Text
          variant="headlineMedium"
          style={styles.title}
          children={t('taglist_empty.title')}
        />
        <Text
          variant="bodyMedium"
          style={styles.desc}
          children={t('taglist_empty.description')}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: '80%',
    aspectRatio: 1.25,
  },
  content_container: {
    gap: 4,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  desc: {
    marginBottom: 8,
  },
})

export default TagListEmpty
