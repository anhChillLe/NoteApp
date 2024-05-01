import { FC } from 'react'
import { StyleSheet } from 'react-native'
import { View, ViewProps } from 'react-native'
import { Text } from 'react-native-paper'
import { SvgProps } from 'react-native-svg'
import { Center, Column, Fill } from '~/components/atoms'

interface Props extends ViewProps {
  Icon: FC<SvgProps>
  title: string
  description: string
}

export const OnboardingPage: FC<Props> = ({
  Icon,
  title,
  description,
  style,
  ...props
}) => {
  return (
    <View collapsable={false} style={[styles.container, style]} {...props}>
      <Center style={styles.icon_container}>
        <Icon style={styles.icon} />
      </Center>
      <Column style={styles.content_container}>
        <Text variant="headlineMedium" style={styles.title}>
          {title}
        </Text>
        <Text variant="bodyLarge" style={styles.desc}>
          {description}
        </Text>
        <Fill />
      </Column>
    </View>
  )
}

const styles = StyleSheet.create({
  icon_container: {
    flex: 1,
  },
  container: {
    alignItems: 'stretch',
  },
  icon: {
    aspectRatio: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content_container: {
    gap: 8,
  },
  title: {
    fontWeight: 'bold',
  },
  desc: {},
})
