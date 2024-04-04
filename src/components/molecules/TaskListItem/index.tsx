import React, { FC } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import {
  Divider,
  Text,
  TouchableRipple,
  TouchableRippleProps,
  useTheme,
} from 'react-native-paper'
import Animated from 'react-native-reanimated'
import { Task, TaskItem } from '~/services/database/model'
import { Item } from './Item'

type Props = Omit<TouchableRippleProps, 'children' | 'style'> & {
  data: Task
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
  maxLineOfTitle?: number
  maxLineOfContent?: number
  onTaskItemPress: (item: TaskItem) => void
}

export const TaskListItem: FC<Props> = ({
  data,
  style,
  contentContainerStyle,
  maxLineOfTitle = 1,
  maxLineOfContent = 4,
  onTaskItemPress,
  ...props
}) => {
  const { id, title, items, importantLevel, updateAt } = data
  const { roundness, colors } = useTheme()

  return (
    <TouchableRipple
      {...props}
      borderless={true}
      style={[
        {
          backgroundColor: colors.elevation.level1,
          borderRadius: roundness * 3,
        },
        style,
      ]}
    >
      <View style={[{ borderRadius: roundness * 3 }]}>
        <Animated.View style={[styles.container, contentContainerStyle]}>
          <Text variant="titleMedium" numberOfLines={maxLineOfTitle}>
            {title}
          </Text>
          <View style={styles.date_row}>
            <Divider style={{ flex: 1 }} />
            <Text variant="labelSmall" style={styles.date_label}>
              {updateAt.toLocaleTimeString()}
            </Text>
          </View>
          <View style={styles.task_list}>
            {items.slice(0, maxLineOfContent).map((item, index) => (
              <Item
                key={index}
                data={item}
                onPress={e => onTaskItemPress(item)}
              />
            ))}
          </View>
        </Animated.View>
      </View>
    </TouchableRipple>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    padding: 12,
    gap: 4,
  },
  date_row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  date_label: {
    opacity: 0.5,
  },
  task_list: {
    gap: 3,
    alignItems: 'stretch',
  },
})
