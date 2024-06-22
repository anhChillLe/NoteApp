import { FC } from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'
import { Text } from 'react-native-paper'
import { StorySet } from '~/assets/storyset'

interface Props extends ViewProps {}

const TagManagerEmpty: FC<Props> = ({ style, ...props }) => {
  return (
    <View style={[styles.container, style]} {...props}>
      <View>
        <StorySet.TagEmpty style={styles.icon} />
      </View>
      <View style={styles.content_container}>
        <Text
          variant="headlineMedium"
          style={styles.title}
          children={strings.title}
        />
        <Text
          variant="bodyMedium"
          style={styles.desc}
          children={strings.description}
        />
      </View>
    </View>
  )
}

const strings = {
  title: 'There are no tags',
  description: "You haven't created any tags yet!",
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

export default TagManagerEmpty