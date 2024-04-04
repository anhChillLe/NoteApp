import { FC } from 'react'
import { ViewProps } from 'react-native'
import { IconButton, Text } from 'react-native-paper'
import { Column, Fill, Row } from '~/components/atoms'

export type HomeHeaderAction = {
  onSettingPress: () => void
  onNotificationPress: () => void
  onSearchPress: () => void
}

type Props = ViewProps & HomeHeaderAction

export const HomeHeader: FC<Props> = ({
  style,
  onSearchPress,
  onNotificationPress,
  onSettingPress,
  ...props
}) => {
  return (
    <Row style={[{ alignItems: 'center' }, style]} {...props}>
      <Column>
        <Text variant="labelSmall">{new Date().toDateString()}</Text>
        <Text variant="titleLarge" style={{ fontWeight: '500' }}>
          Chill note
        </Text>
      </Column>
      <Fill />
      <Row>
        <IconButton icon="search" onPress={onSearchPress} />
        <IconButton icon="bell" onPress={onNotificationPress} />
        <IconButton icon="settings" onPress={onSettingPress} />
      </Row>
    </Row>
  )
}
