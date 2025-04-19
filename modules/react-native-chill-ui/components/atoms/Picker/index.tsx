import { FC } from 'react'
import {
  FlatList,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
} from 'react-native'
import Animated, {
  AnimatedProps,
  runOnJS,
  useAnimatedRef,
  useAnimatedScrollHandler,
} from 'react-native-reanimated'
import { useTheme } from '../../../styles/ThemeProvider'
import Text from '../Text'

interface PickerProps {
  data: (string | number)[]
  mode?: 'onScroll' | 'onScrollEnd'
  onChange: (index: number) => void
  init?: number
}

const ITEM_HEIGHT = 64
const HEIGHT = ITEM_HEIGHT * 5
const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
const Picker: FC<PickerProps> = ({
  data,
  onChange,
  mode = 'onScrollEnd',
  init = 0,
}) => {
  const { colors, roundness } = useTheme()
  const ref = useAnimatedRef<FlatList>()

  const handler = useAnimatedScrollHandler({
    onScroll: e => {
      if (mode === 'onScroll') {
        runOnJS(onChange)(Math.round(e.contentOffset.y / ITEM_HEIGHT))
      }
    },
    onMomentumEnd: e => {
      if (mode === 'onScrollEnd') {
        runOnJS(onChange)(Math.round(e.contentOffset.y / ITEM_HEIGHT))
      }
    },
  })

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.select,
          {
            borderRadius: roundness * 3,
            backgroundColor: colors.surfaceVariant,
          },
        ]}
      />

      <Animated.FlatList
        ref={ref}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        removeClippedSubviews
        initialScrollIndex={init}
        onScroll={handler}
        decelerationRate="fast"
        data={data}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        ListHeaderComponent={
          <>
            <View style={styles.item} />
            <View style={styles.item} />
          </>
        }
        ListFooterComponent={
          <>
            <View style={styles.item} />
            <View style={styles.item} />
          </>
        }
        keyExtractor={item => item.toString()}
        renderItem={({ item, index }) => (
          <Item
            label={item.toString()}
            onPress={() => ref.current?.scrollToIndex({ index })}
            accessibilityLabel={item.toString()}
          />
        )}
      />
    </View>
  )
}

interface ItemProps extends AnimatedProps<PressableProps> {
  label: string
}

const Item: FC<ItemProps> = ({ label, style, ...props }) => {
  return (
    <AnimatedPressable style={[styles.item, style]} {...props}>
      <Text style={styles.item_label} variant="titleLarge" children={label} />
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  item: {
    height: ITEM_HEIGHT,
    width: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  select: {
    height: ITEM_HEIGHT,
    width: ITEM_HEIGHT,
    position: 'absolute',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  item_label: {
    fontWeight: '700',
    // fontSize: 24,
  },
})

export default Picker
export type { PickerProps }
