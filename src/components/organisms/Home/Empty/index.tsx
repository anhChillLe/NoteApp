import { FC } from 'react'
import { ViewProps, View, StyleSheet } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { StorySet } from '~/assets/storyset'

interface Props extends ViewProps {
  onNewItem: () => void
}

export const HomeEmpty: FC<Props> = ({ style, onNewItem, ...props }) => {
  return (
    <View style={[styles.container, style]} {...props}>
      <StorySet.AddNote style={styles.icon} />
      <View style={styles.title_container}>
        <Text variant="titleLarge" style={styles.title}>
          There are no notes
        </Text>
        <Text variant="bodySmall" style={styles.description}>
          You haven't created any notes yet!
        </Text>
      </View>
      <Button mode="contained" icon="plus-small" onPress={onNewItem}>
        Create now
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  icon: {
    width: '60%',
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
