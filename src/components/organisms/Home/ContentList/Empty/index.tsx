import { FC } from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'
import { Text } from 'react-native-paper'
import Animated, { AnimatedProps } from 'react-native-reanimated'
import { StorySet } from '~/assets/storyset'

interface Props extends AnimatedProps<ViewProps> {}

export const HomeEmpty: FC<Props> = ({ style, ...props }) => {
  return (
    <Animated.View style={[styles.container, style]} {...props}>
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
