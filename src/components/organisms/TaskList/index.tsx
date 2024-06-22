import { FC, useCallback, useState } from 'react'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'
import { Button, Checkbox, IconButton, useTheme } from 'react-native-paper'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Input } from '~/components/atoms'

interface Item {
  label: string
  status: TaskItemStatus
}
interface Props extends ViewProps {
  items: Item[]
  onCheckPress: (index: number) => void
  onDisablePress: (index: number) => void
  onDeletePress: (ndex: number) => void
  onLabelChange: (index: number, text: string) => void
  onNewItem: (label: string) => void
  itemStyle?: StyleProp<ViewStyle>
}

const TaskList: FC<Props> = ({
  items,
  onCheckPress,
  onDeletePress,
  onLabelChange,
  onDisablePress,
  onNewItem,
  style,
  itemStyle,
  ...props
}) => {
  const { colors, roundness } = useTheme()
  const [text, setText] = useState('')

  const handleSubmit = useCallback(() => {
    if (!text) return
    onNewItem(text)
    setText('')
  }, [])

  return (
    <View style={[styles.container, style]} {...props}>
      {items.map((item, index) => {
        const isDisable = item.status == 'indeterminate'
        const handleCheckPress = () => onCheckPress(index)
        const handleChangeText = (label: string) => onLabelChange(index, label)
        const handleDisablePress = () => onDisablePress(index)
        const handleDeletePress = () => onDeletePress(index)
        return (
          <Animated.View key={index} entering={FadeInDown} style={itemStyle}>
            <Animated.View style={styles.item_container}>
              <Checkbox.Android
                status={item.status}
                onPress={handleCheckPress}
              />
              <Input
                value={item.label}
                style={[
                  styles.editor,
                  { textDecorationLine: isDisable ? 'line-through' : 'none' },
                ]}
                multiline
                editable={!isDisable}
                onChangeText={handleChangeText}
              />
              <IconButton
                icon={isDisable ? 'plus' : 'minus'}
                size={14}
                onPress={handleDisablePress}
              />
              <IconButton icon="cross" size={14} onPress={handleDeletePress} />
            </Animated.View>
          </Animated.View>
        )
      })}
      <View
        style={[
          styles.input_container,
          {
            borderRadius: roundness * 3,
            borderColor: colors.primaryContainer,
          },
        ]}
      >
        <IconButton icon="plus" size={14} />
        <Input
          value={text}
          onChangeText={setText}
          placeholder="Add a new item"
          blurOnSubmit={false}
          style={styles.editor}
          onSubmitEditing={handleSubmit}
        />
        <Button children="OK" onPress={handleSubmit} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  item_container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  editor: {
    flex: 1,
  },
  input_container: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
  },
})

export default TaskList
