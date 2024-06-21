import { FC, useCallback } from 'react'
import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextInputSubmitEditingEventData,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'
import { Checkbox, IconButton, TextInput } from 'react-native-paper'
import Animated, {
  FadeInDown,
  FadeOutDown,
  FadeOutUp,
} from 'react-native-reanimated'
import { Input } from '~/components/atoms'
import useMemoThemeStyle from '~/hooks/theme'

interface Item {
  label: string
  status: TaskItemStatus
}
type SubmitEvent = NativeSyntheticEvent<TextInputSubmitEditingEventData>
type SubmitCallback = (e: SubmitEvent) => void
interface Props extends ViewProps {
  items: Item[]
  onCheckPress: (index: number) => void
  onDisablePress: (index: number) => void
  onDeletePress: (ndex: number) => void
  onLabelChange: (index: number, text: string) => void
  onNewItem: (label: string) => void
  itemStyle?: StyleProp<ViewStyle>
}

export const TaskItemList: FC<Props> = ({
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
  const handleSubmit = useCallback<SubmitCallback>(e => {
    const label = e.nativeEvent.text
    if (!label) return
    e.currentTarget.setNativeProps({ text: '' })
    onNewItem(label)
  }, [])

  const inputContainerStyle = useMemoThemeStyle(({ colors, roundness }) => {
    return {
      borderRadius: roundness * 3,
      borderColor: colors.primaryContainer,
    }
  }, [])

  return (
    <View style={[styles.container, style]} {...props}>
      {items.map((item, index) => {
        const isDisable = item.status == 'indeterminate'
        const handleCheckPress = () => {
          onCheckPress(index)
        }
        const handleChangeText = (label: string) => {
          onLabelChange(index, label)
        }
        const handleDisablePress = () => onDisablePress(index)

        const handleDeletePress = () => onDeletePress(index)

        const icon = isDisable ? 'plus' : 'minus'

        const containerStyle: ViewStyle = {
          opacity: isDisable ? 0.6 : undefined,
        }

        const editorStyle: TextStyle = {
          textDecorationLine: isDisable ? 'line-through' : 'none',
        }

        return (
          <Animated.View key={index} entering={FadeInDown} style={itemStyle}>
            <Animated.View style={[styles.item_container, containerStyle]}>
              <Checkbox.Android
                status={item.status}
                onPress={handleCheckPress}
              />
              <Input
                value={item.label}
                style={[styles.editor, editorStyle]}
                multiline
                editable={!isDisable}
                onChangeText={handleChangeText}
              />
              <IconButton icon={icon} size={14} onPress={handleDisablePress} />
              <IconButton icon="cross" size={14} onPress={handleDeletePress} />
            </Animated.View>
          </Animated.View>
        )
      })}
      <View style={[styles.input_container, inputContainerStyle]}>
        <IconButton icon="plus" size={14} />
        <Input
          placeholder="Add a new item"
          blurOnSubmit={false}
          style={styles.editor}
          onSubmitEditing={handleSubmit}
        />
      </View>
    </View>
  )
}

export default TaskItemList

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
