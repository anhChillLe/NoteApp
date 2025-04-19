import { FC, Ref } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FlatList,
  ListRenderItem,
  ScrollViewProps,
  StyleSheet,
} from 'react-native'
import { Checkbox, IconButton, TextInput } from 'react-native-chill-ui'
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated'
import { TaskItemDataWithId } from '~/screens/Editor/Provider'

interface Props extends Partial<ScrollViewProps> {
  ref?: Ref<FlatList>
  items: TaskItemDataWithId[]
  onCheckPress: (index: number) => void
  onDeletePress: (index: number) => void
  onLabelChange: (index: number, text: string) => void
}

const TaskList: FC<Props> = ({
  ref,
  items,
  onCheckPress,
  onDeletePress,
  onLabelChange,
  ...props
}) => {
  const { t } = useTranslation()
  const renderItem: ListRenderItem<TaskItemDataWithId> = ({ item, index }) => {
    const handleCheckPress = () => onCheckPress(index)
    const handleChangeText = (label: string) => onLabelChange(index, label)
    const handleDeletePress = () => onDeletePress(index)
    return (
      <Animated.View style={styles.item_container} entering={FadeInDown}>
        <Checkbox
          status={item.isChecked ? 'checked' : 'unchecked'}
          accessibilityLabel={t(item.isChecked ? 'check' : 'uncheck')}
          onPress={handleCheckPress}
        />
        <TextInput
          value={item.label}
          style={[styles.editor, item.isChecked && styles.checked]}
          onChangeText={handleChangeText}
          scrollEnabled={false}
          autoCorrect={false}
          multiline={false}
        />
        <IconButton
          icon="close-outline"
          onPress={handleDeletePress}
          accessibilityLabel={`${t('delete')} ${item.label}`}
        />
      </Animated.View>
    )
  }

  return (
    <Animated.FlatList
      ref={ref}
      data={items}
      renderItem={renderItem}
      keyboardDismissMode={'none'}
      keyboardShouldPersistTaps={'never'}
      removeClippedSubviews={false}
      showsVerticalScrollIndicator={false}
      keyExtractor={keyExtractor}
      itemLayoutAnimation={LinearTransition}
      {...props}
    />
  )
}

const keyExtractor = (item: TaskItemDataWithId) => item.id.toString()

const styles = StyleSheet.create({
  item_container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  editor: {
    flex: 1,
  },
  checked: {
    textDecorationLine: 'line-through',
  },
})

export default TaskList
