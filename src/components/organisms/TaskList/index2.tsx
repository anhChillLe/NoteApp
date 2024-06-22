import { FC, useState } from 'react'
import { ListRenderItem, StyleSheet, View, ViewProps } from 'react-native'
import { Button, Checkbox, IconButton, useTheme } from 'react-native-paper'
import Animated from 'react-native-reanimated'
import { Input } from '~/components/atoms'
import { TaskItemData } from '~/services/database/model/TaskItem'

interface Props extends ViewProps {
  items: TaskItemData[]
  onCheckPress: (index: number) => void
  onDisablePress: (index: number) => void
  onDeletePress: (ndex: number) => void
  onLabelChange: (index: number, text: string) => void
  onNewItem: (label: string) => void
}

const TaskList: FC<Props> = ({
  items,
  onCheckPress,
  onDeletePress,
  onLabelChange,
  onDisablePress,
  onNewItem,
  style,
  ...props
}) => {
  const renderItem: ListRenderItem<TaskItemData> = ({ item, index }) => {
    const isDisable = item.status == 'indeterminate'
    const handleCheckPress = () => onCheckPress(index)
    const handleChangeText = (label: string) => onLabelChange(index, label)
    const handleDisablePress = () => onDisablePress(index)
    const handleDeletePress = () => onDeletePress(index)
    return (
      <View style={styles.item_container}>
        <Checkbox.Android status={item.status} onPress={handleCheckPress} />
        <Input
          value={item.label}
          style={[
            styles.editor,
            { textDecorationLine: isDisable ? 'line-through' : 'none' },
          ]}
          editable={!isDisable}
          onChangeText={handleChangeText}
          autoCorrect={false}
          multiline
        />
        <IconButton
          icon={isDisable ? 'plus' : 'minus'}
          size={14}
          onPress={handleDisablePress}
        />
        <IconButton icon="cross" size={14} onPress={handleDeletePress} />
      </View>
    )
  }

  return (
    <View style={[styles.container, style]} {...props}>
      <Animated.FlatList
        data={items}
        renderItem={renderItem}
        style={styles.list}
        contentContainerStyle={styles.content}
        keyboardDismissMode={'none'}
        keyboardShouldPersistTaps={'never'}
        removeClippedSubviews={false}
        showsVerticalScrollIndicator={false}
      />
      <TaskCreator onSubmit={onNewItem} />
    </View>
  )
}

const TaskCreator: FC<{ onSubmit: (text: string) => void }> = ({
  onSubmit,
}) => {
  const { colors, roundness } = useTheme()
  const [text, setText] = useState('')

  const handleSubmit = () => {
    if (!text) return
    onSubmit(text)
    setText('')
  }
  return (
    <View
      style={[
        styles.input_container,
        {
          backgroundColor: colors.background,
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
        autoCorrect={false}
      />
      <Button children="OK" onPress={handleSubmit} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  item_container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  editor: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  input_container: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    marginVertical: 8,
  },
})

export default TaskList
