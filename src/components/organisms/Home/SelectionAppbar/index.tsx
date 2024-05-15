import { FC, useCallback } from 'react'
import { StyleSheet, ViewProps } from 'react-native'
import { IconButton, Text, useTheme } from 'react-native-paper'
import Animated, {
  AnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { useHomeSelect } from '~/store/home'
import { useHome } from '../Provider'

interface Props extends AnimatedProps<ViewProps> {}

export const HomeSelectionAppbar: FC<Props> = ({ style, ...props }) => {
  const { colors } = useTheme()
  const notes = useHome(state => state.notes)
  const { isInSelectMode, selecteds, disable, enable, select, set } =
    useHomeSelect()

  const numOfItem = useHomeSelect(state => state.selecteds.length)

  const checkAll = useCallback(() => {
    const isAllChecked = selecteds.length === notes.length
    set(isAllChecked ? [] : notes.map(it => it))
  }, [set, notes, selecteds])

  const containerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: colors.surfaceVariant,
    }
  }, [])

  return (
    <Animated.View style={[styles.container, containerStyle, style]} {...props}>
      <Animated.View style={styles.sub_container}>
        <IconButton icon="cross-small" onPress={disable} />
        <Text style={[styles.label]} variant="titleMedium">
          {numOfItem} selecteds
        </Text>
        <IconButton icon="list-check" onPress={checkAll} />
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
  },
  label: {
    flex: 1,
  },
})
