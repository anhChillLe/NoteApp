import { FC, Ref } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewProps } from 'react-native'
import { Text } from 'react-native-chill-ui'
import Animated from 'react-native-reanimated'
import { EmptyNoteIcon } from '~/assets/storyset'

interface Props extends ViewProps {
  ref?: Ref<View>
}

const NoteListEmpty: FC<Props> = ({ ref, style, ...props }) => {
  const { t } = useTranslation()
  return (
    <Animated.View ref={ref} style={[styles.container, style]} {...props}>
      <EmptyNoteIcon style={styles.icon} />
      <View style={styles.title_container}>
        <Text
          variant="titleLarge"
          style={styles.title}
          children={t('notelist_empty.title')}
        />
        <Text
          variant="bodySmall"
          style={styles.description}
          children={t('notelist_empty.description')}
        />
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    flex: 1,
  },
  icon: {
    height: 256,
    aspectRatio: 1,
  },
  title_container: {
    gap: 2,
    alignItems: 'center',
  },
  title: {
    fontWeight: '600',
  },
  description: {
    opacity: 0.6,
  },
})

export default NoteListEmpty
