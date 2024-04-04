import React, { FC, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Divider, IconButton, Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Fill, Row } from '~/components/atoms'
import { Editor, ImportantLevelMenu, TagMenu } from '~/components/molecules'
import { useDebounceWatch } from '~/hooks/debounce_watch'
import { Tag, Task } from '~/services/database/model'

export interface TaskForm {
  title: string
  items: { label: string; status: TaskItemStatus }[]
  importantLevel: ImportantLevel
  tag: Tag | null
}

interface Props {
  task?: Task | null
  tags: Tag[]
  onChange: (data: TaskForm) => void
  onBackPress: () => void
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
    defaultValues: task?.data,
  })

  const [items, title, importantLevel, tag] = useDebounceWatch({
    control,
    name: ['items', 'title', 'importantLevel', 'tag'],
    delay: 300,
  })

  useEffect(() => {
    if (!isDirty) return
    onChange({ items, title, importantLevel, tag })
  }, [items, title, importantLevel, tag, isDirty, onChange])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="angle-left" onPress={onBackPress} />
        <Fill />
        <IconButton icon="bookmark" />
        <Row style={styles.tag_container}>
          <Controller
            name="importantLevel"
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <ImportantLevelMenu
                  currentLevel={value}
                  onImportantLevelChange={onChange}
                />
              )
            }}
          />
          <Controller
            name="tag"
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <TagMenu
                  tags={tags.map(it => it)}
                  currentTag={value}
                  onTagPress={onChange}
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
                mode="bold"
                size="h2"
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
            {task?.updateAt.toLocaleString()}
          </Text>
        </Row>
        <ScrollView
          keyboardShouldPersistTaps="always"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
        >
          <Controller
            name="items"
            control={control}
            render={({ field: { value, onChange } }) => {
              return (
                <Editor.TaskListItem
                  items={value ?? []}
                  onCheckPress={item => {
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
                  }}
                  onDeletePress={(_, index) => {
                    value.splice(index, 1)
                    onChange([...value])
                  }}
                  onDisablePress={item => {
                    item.status =
                      item.status == 'indeterminate'
                        ? 'unchecked'
                        : 'indeterminate'
                    onChange([...value])
                  }}
                  onLabelChange={(item, label) => {
                    item.label = label
                    onChange([...value])
                  }}
                  onNewItem={label => {
                    onChange([...(value ?? []), { label, status: 'unchecked' }])
                  }}
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
  content: {
    flex: 1,
    textAlignVertical: 'top',
  },
  toolbar: {
    paddingHorizontal: 8,
  },
  tag_container: {
    gap: 8,
  },
})
