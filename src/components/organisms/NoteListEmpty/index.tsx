import { FC } from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'
import { Text } from 'react-native-paper'
import Animated, {
  AnimatedProps,
  LinearTransition,
} from 'react-native-reanimated'
import { StorySet } from '~/assets/storyset'

interface Props extends AnimatedProps<ViewProps> {}

const NoteListEmpty: FC<Props> = ({ style, ...props }) => {
  return (
    <Animated.View
      style={[styles.container, style]}
      layout={LinearTransition}
      {...props}
    >
      <StorySet.AddNote style={styles.icon} />
      <View style={styles.title_container}>
        <Text variant="titleLarge" style={styles.title}>
          {strings.title}
        </Text>
        <Text variant="bodySmall" style={styles.description}>
          {strings.description}
        </Text>
      </View>
    </Animated.View>
  )
}

const strings = {
  title: 'There are no notes',
  description: "You haven't created any notes yet!",
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
