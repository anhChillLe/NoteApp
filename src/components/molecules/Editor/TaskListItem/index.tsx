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
import { Checkbox, IconButton } from 'react-native-paper'
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated'
import { Row } from '~/components/atoms'
import { Editor } from '..'
import { TextEditor } from '../Text'

interface Item {
  label: string
  status: TaskItemStatus
}
type SubmitEvent = NativeSyntheticEvent<TextInputSubmitEditingEventData>
type SubmitCallback = (e: SubmitEvent) => void
interface Props extends ViewProps {
  items: Item[]
  onCheckPress: (item: Item) => void
  onDisablePress: (item: Item) => void
  onDeletePress: (item: Item, index: number) => void
  onLabelChange: (item: Item, text: string) => void
  onNewItem: (label: string) => void
  itemStyle?: StyleProp<ViewStyle>
}

export const TaskListItemEditor: FC<Props> = ({
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

  return (
    <View style={[styles.container, style]} {...props}>
      {items.map((item, index) => {
        const isDisable = item.status == 'indeterminate'
        const handleCheckPress = () => {
          onCheckPress(item)
        }
        const handleChangeText = (label: string) => {
          onLabelChange(item, label)
        }
        const handleDisablePress = () => onDisablePress(item)

        const handleDeletePress = () => onDeletePress(item, index)

        const icon = isDisable ? 'plus' : 'minus'

        const containerStyle: ViewStyle = {
          opacity: isDisable ? 0.6 : 1,
        }

        const editorStyle: TextStyle = {
          textDecorationLine: isDisable ? 'line-through' : undefined,
        }

        return (
          <Animated.View
            key={index}
            entering={FadeInDown}
            exiting={FadeOutUp}
            style={[styles.item_container, containerStyle, itemStyle]}
          >
            <Checkbox.Android status={item.status} onPress={handleCheckPress} />
            <TextEditor
              value={item.label}
              style={[styles.editor, editorStyle]}
              multiline
              editable={!isDisable}
              onChangeText={handleChangeText}
            />
            <IconButton icon={icon} size={14} onPress={handleDisablePress} />
            <IconButton icon="cross" size={14} onPress={handleDeletePress} />
          </Animated.View>
        )
      })}
      <Row style={{ alignItems: 'center' }}>
        <IconButton icon="plus" size={14} />
        <Editor.Text
          placeholder="Add a new item"
          blurOnSubmit={false}
          style={styles.editor}
          onSubmitEditing={handleSubmit}
        />
      </Row>
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
})
