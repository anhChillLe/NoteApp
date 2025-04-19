import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, ViewProps } from 'react-native'
import { IconButton, Text, useTheme } from 'react-native-chill-ui'
import Animated, { AnimatedProps } from 'react-native-reanimated'

interface Props extends AnimatedProps<ViewProps> {
  onClosePress: () => void
  onCheckAllPress: () => void
  numOfItem: number
}

const SelectionAppbar: FC<Props> = ({
  onCheckAllPress,
  onClosePress,
  numOfItem,
  style,
  ...props
}) => {
  const { t } = useTranslation()
  const { colors } = useTheme()

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.surfaceVariant },
        style,
      ]}
      {...props}
    >
      <Animated.View style={styles.sub_container}>
        <IconButton
          icon="close-outline"
          onPress={onClosePress}
          iconColor={colors.onSurfaceVariant}
        />
        <Text
          style={[styles.label, { color: colors.onSurfaceVariant }]}
          variant="titleMedium"
          children={t('selection', { count: numOfItem })}
        />
        <IconButton
          icon="list-outline"
          onPress={onCheckAllPress}
          iconColor={colors.onSurfaceVariant}
        />
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    paddingHorizontal: 8,
  },
  sub_container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    flex: 1,
  },
})

export default SelectionAppbar
