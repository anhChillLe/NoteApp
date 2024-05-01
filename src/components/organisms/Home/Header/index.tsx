import { FC } from 'react'
import { StyleSheet, ViewProps } from 'react-native'
import { IconButton, Text } from 'react-native-paper'
import Animated, { AnimatedProps } from 'react-native-reanimated'
import { Column, Fill, Row } from '~/components/atoms'

export type HomeHeaderAction = {
  onSettingPress: () => void
  onFolderPress: () => void
  onSearchPress: () => void
}

type Props = AnimatedProps<ViewProps> & HomeHeaderAction

export const HomeHeader: FC<Props> = ({
  onSearchPress,
  onFolderPress,
  onSettingPress,
  style,
  ...props
}) => {
  return (
    <Animated.View style={[styles.container, style]} {...props}>
      <Column>
        <Text variant="labelSmall">{new Date().toDateString()}</Text>
        <Text variant="titleLarge" style={{ fontWeight: '500' }}>
          {strings.appName}
        </Text>
      </Column>
      <Fill />
      <Row>
        <IconButton icon="search" onPress={onSearchPress} />
        <IconButton icon="folder" onPress={onFolderPress} />
        <IconButton icon="settings" onPress={onSettingPress} />
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
})
