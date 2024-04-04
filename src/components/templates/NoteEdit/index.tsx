import React, { FC, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import { Divider, IconButton, Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Fill, Row } from '~/components/atoms'
import { Editor, ImportantLevelMenu, TagMenu } from '~/components/molecules'
import { useDebounceWatch } from '~/hooks/debounce_watch'
import { Note, Tag } from '~/services/database/model'

export interface NoteForm {
  title: string
  content: string
  importantLevel: ImportantLevel
  tag: Tag | null
}

interface Props {
  note?: Note | null
  tags: Tag[]
  onChange: (data: NoteForm) => void
  onBackPress: () => void
}

export const NoteEditLayout: FC<Props> = ({
  onBackPress,
  onChange,
  tags,
  note,
}) => {
  const {
    control,
    formState: { isDirty },
  } = useForm<NoteForm>({
    defaultValues: note?.data,
  })

  const [title, content, importantLevel, tag] = useDebounceWatch({
    control,
    name: ['title', 'content', 'importantLevel', 'tag'],
    delay: 300,
  })

  useEffect(() => {
    if (!isDirty) return
    onChange({ title, content, importantLevel, tag })
  }, [title, content, importantLevel, tag, isDirty, onChange])

  return (
    <SafeAreaView style={styles.container}>
      <Row style={styles.header}>
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
      </Row>
      <View style={styles.content_container}>
        <Controller
          name="title"
          control={control}
          render={({ field: { value, onChange, onBlur, ref } }) => {
            return (
              <Editor.Text
                value={value}
                ref={ref}
                onChangeText={onChange}
                onBlur={onBlur}
                mode="bold"
                size="h2"
                multiline
                numberOfLines={2}
                placeholder="Title"
              />
            )
          }}
        />
        <Row style={styles.divider_container}>
          <Divider style={styles.divider} />
          <Text variant="labelSmall" style={styles.time}>
            {note?.updateAt.toLocaleString()}
          </Text>
        </Row>
        <Controller
          name="content"
          control={control}
          render={({ field: { value, onChange, onBlur, ref } }) => {
            return (
              <Editor.Text
                value={value}
                ref={ref}
                onChangeText={onChange}
                onBlur={onBlur}
                style={styles.content}
                onLayout={e => e.currentTarget.focus()}
                autoCapitalize="sentences"
                multiline
                mode="default"
                size="content"
                placeholder="Content for note"
              />
            )
          }}
        />
      </View>
      <Editor.Toolbar style={styles.toolbar} />
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
    gap: 8,
  },
  header: {
    alignItems: 'center',
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
