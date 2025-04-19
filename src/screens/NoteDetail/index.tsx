import { StaticScreenProps, useNavigation } from '@react-navigation/native'
import { Note, useObject } from 'note-app-database'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { Text, useTheme } from 'react-native-chill-ui'
import { FadeInDown } from 'react-native-reanimated'
import { BSON } from 'realm'
import { AnimatedPressable, AnimatedShape } from '~/components'

type Props = StaticScreenProps<{ id: string }>

const NoteDetailScreen: FC<Props> = ({ route }) => {
  const id = route.params.id
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation()
  const note = useObject({ type: Note, primaryKey: new BSON.UUID(id) })

  if (!note) {
    navigation.goBack()
    return null
  }

  const { createAt, updateAt } = note.data

  return (
    <View
      style={styles.container}
      accessibilityViewIsModal
      accessibilityLiveRegion="polite"
    >
      <AnimatedPressable
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.backdrop }]}
        onPress={navigation.goBack}
        accessibilityLabel={t('go_back')}
        accessibilityRole="button"
        importantForAccessibility="no"
      />
      <AnimatedShape
        style={styles.content}
        roundnessLevel={5}
        entering={FadeInDown}
      >
        <Text
          variant="titleLarge"
          style={styles.title}
          children={t('detail_info')}
        />
        <View style={styles.info_item}>
          <Text style={styles.info_item_title} children={t('create_at')} />
          <Text children={t('date_time', { value: createAt })} />
        </View>
        <View style={styles.info_item}>
          <Text style={styles.info_item_title} children={t('update_at')} />
          <Text children={t('date_time', { value: updateAt })} />
        </View>
      </AnimatedShape>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    margin: 16,
    gap: 4,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  title: {
    fontWeight: '700',
    marginBottom: 16,
  },
  info_item: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  info_item_title: {
    fontWeight: '600',
  },
})

export default NoteDetailScreen
