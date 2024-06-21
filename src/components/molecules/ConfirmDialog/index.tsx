import { FC } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Icon, Text } from 'react-native-paper'
import { Dialog, DialogProps } from '~/components/atoms'
import Shape from '~/components/atoms/Shape'

interface Action {
  title: string
  icon?: string
  disable?: boolean
  primary?: boolean
  onPress: () => void
}

interface Props extends Omit<DialogProps, 'children'> {
  title: string
  content: string
  actions: Action[]
  icon?: string
}

const ConfirmDialog: FC<Props> = ({
  title,
  content,
  actions,
  icon,
  ...props
}) => {
  return (
    <Dialog {...props}>
      <Shape style={styles.content_container} roundnessLevel={4}>
        <Text variant="titleLarge" style={styles.title}>
          {title}
        </Text>
        <Text variant="bodyMedium">{content}</Text>
        <View style={styles.action_container}>
          {actions.map((action, index) => {
            const { title, disable, onPress, primary, icon } = action
            const mode = primary ? 'contained' : 'outlined'
            return (
              <Button
                key={index}
                children={title}
                disabled={disable}
                onPress={onPress}
                mode={mode}
                icon={icon}
              />
            )
          })}
        </View>
      </Shape>
    </Dialog>
  )
}

const styles = StyleSheet.create({
  content_container: {
    alignItems: 'stretch',
    padding: 16,
    gap: 8,
  },
  title: {
    fontWeight: '700',
  },
  action_container: {
    flexDirection: 'row-reverse',
    gap: 8,
    marginTop: 12,
  },
})

export default ConfirmDialog
