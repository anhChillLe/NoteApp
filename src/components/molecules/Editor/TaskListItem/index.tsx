import { View, ViewProps, ViewStyle } from 'react-native'
import { Checkbox, IconButton } from 'react-native-paper'
import { Row } from '~/components/atoms'
import { Editor } from '..'
import { TaskItem } from '~/services/database/model'
import { FC } from 'react'
import { TextEditor } from '../Text'
import { StyleProp } from 'react-native'

interface Item {
  label: string
  status: TaskItemStatus
}
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
  return (
    <View style={[{ gap: 8 }, style]} {...props}>
      {items.map((item, index) => {
        const isDisable = item.status == 'indeterminate'

        return (
          <View
            key={index}
            style={[
              {
                alignItems: 'center',
                flexDirection: 'row',
                opacity: isDisable ? 0.6 : 1,
              },
              itemStyle,
            ]}
          >
            <Checkbox.Android
              status={item.status}
              onPress={() => {
                onCheckPress(item)
              }}
            />
            <TextEditor
              value={item.label}
              style={{
                flex: 1,
                textDecorationLine: isDisable ? 'line-through' : undefined,
              }}
              multiline
              editable={!isDisable}
              onChangeText={label => {
                onLabelChange(item, label)
              }}
            />
            <IconButton
              icon={isDisable ? 'plus' : 'minus'}
              size={14}
              onPress={() => {
                onDisablePress(item)
              }}
            />
            <IconButton
              icon="cross"
              size={14}
              onPress={() => {
                onDeletePress(item, index)
              }}
            />
          </View>
        )
      })}
      <Row style={{ alignItems: 'center' }}>
        <IconButton icon="plus" size={14} />
        <Editor.Text
          placeholder="Add a new item"
          blurOnSubmit={false}
          style={{ flex: 1 }}
          onSubmitEditing={e => {
            const label = e.nativeEvent.text
            e.currentTarget.setNativeProps({ text: '' })
            onNewItem(label)
          }}
        />
      </Row>
    </View>
  )
}
