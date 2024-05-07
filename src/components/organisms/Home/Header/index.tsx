import { FC } from 'react'
import { StyleSheet, ViewProps } from 'react-native'
import { IconButton, Text } from 'react-native-paper'
import Animated, { AnimatedProps } from 'react-native-reanimated'
import { Column, Fill, Row } from '~/components/atoms'
import { useHome } from '../Provider'

interface Props extends AnimatedProps<ViewProps> {}

export const HomeHeader: FC<Props> = ({ style, ...props }) => {
  const openSetting = useHome(state => state.openSetting)
  const openTagManager = useHome(state => state.openTagManager)
  const openSearch = useHome(state => state.openSearch)

  return (
    <Animated.View style={[styles.container, style]} {...props}>
      <Column>
        <Text variant="labelSmall">{new Date().toDateString()}</Text>
        <Text variant="titleLarge" style={styles.title}>
          {strings.appName}
        </Text>
      </Column>
      <Fill />
      <Row>
        <IconButton icon="search" onPress={openSearch} />
        <IconButton icon="folder" onPress={openTagManager} />
        <IconButton icon="settings" onPress={openSetting} />
      </Row>
    </Animated.View>
  )
}

const strings = {
  appName: 'Chill note',
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    fontWeight: '500',
  },
})
