import React, { FC, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Divider, IconButton, Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Fill, Row } from '~/components/atoms'
import { Editor, TagMenu } from '~/components/molecules'
import { useDebounceWatch } from '~/hooks/debounce_watch'
import { Note, Tag } from '~/services/database/model'

type Item = { label: string; status: TaskItemStatus }
export interface TaskForm {
  title: string
  taskList: Item[]
  tags: Tag[]
}

interface Props {
  task?: Note | null
  tags: Tag[]
  onChange: (data: TaskForm) => void
  onBackPress: () => void
}

const defaultValues: TaskForm = {
  title: '',
  taskList: [],
  tags: [],
}

export const TaskEditLayout: FC<Props> = ({
  onChange,
  onBackPress,
  task,
  tags,
}) => {
  const {
    control,
    formState: { isDirty },
  } = useForm<TaskForm>({
    defaultValues: {
      ...defaultValues,
      ...task?.data,
    },
  })

  const [taskList, title, itemTags] = useDebounceWatch({
    control,
    name: ['taskList', 'title', 'tags'],
    delay: 300,
  })

  useEffect(() => {
    if (!isDirty) return
    onChange({ taskList, title, tags: itemTags })
  }, [taskList, title, itemTags, isDirty, onChange])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="angle-left" onPress={onBackPress} />
        <Fill />
        <IconButton icon="bookmark" />
        <Row style={styles.tag_container}>
          <Controller
            name="tags"
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <TagMenu
                  tags={tags.map(it => it)}
                  currents={value}
                  onChange={onChange}
                />
              )
            }}
          />
        </Row>
        <IconButton icon="menu-dots-vertical" />
      </View>
      <View style={styles.content_container}>
        <Controller
          control={control}
          name="title"
          render={({ field: { value, onChange } }) => {
            return (
              <Editor.Text
                style={styles.title}
                placeholder="Title"
                value={value}
                onChangeText={onChange}
              />
            )
          }}
        />
        <Row style={styles.divider_container}>
          <Divider style={styles.divider} />
          <Text variant="labelSmall" style={styles.time}>
            {task?.updateAt.toLocaleString() ?? new Date().toLocaleString()}
          </Text>
        </Row>
        <ScrollView
          keyboardShouldPersistTaps="always"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
        >
          <Controller
            name="taskList"
            control={control}
            render={({ field: { value, onChange } }) => {
              const onCheckPress = (item: Item) => {
                switch (item.status) {
                  case 'checked':
                    item.status = 'unchecked'
                    break
                  case 'unchecked':
                    item.status = 'checked'
                    break
                  case 'indeterminate':
                    break
                }
                onChange([...value])
              }

              const onDeletePress = (item: Item, index: number) => {
                value.splice(index, 1)
                onChange([...value])
              }

              const onDisablePress = (item: Item) => {
                item.status =
                  item.status == 'indeterminate' ? 'unchecked' : 'indeterminate'
                onChange([...value])
              }

              const onLabelChange = (item: Item, label: string) => {
                item.label = label
                onChange([...value])
              }

              const onNewItem = (label: string) => {
                value.push({ label, status: 'unchecked' })
                onChange([...value])
              }

              return (
                <Editor.TaskListItem
                  items={value}
                  onCheckPress={onCheckPress}
                  onDeletePress={onDeletePress}
                  onDisablePress={onDisablePress}
                  onLabelChange={onLabelChange}
                  onNewItem={onNewItem}
                />
              )
            }}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content_container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  divider: {
    flex: 1,
  },
  divider_container: {
    alignItems: 'center',
    gap: 8,
  },
  time: {
    fontWeight: '500',
  },
  title: {
    fontWeight: '600',
    fontSize: 24,
  },
  toolbar: {
    paddingHorizontal: 8,
  },
  tag_container: {
    gap: 8,
  },
})
