import React, { FC, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import { Divider, IconButton, Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Fill, Row } from '~/components/atoms'
import { Editor, TagMenu } from '~/components/molecules'
import { useDebounceWatch } from '~/hooks/debounce_watch'
import { Note, Tag } from '~/services/database/model'

export interface NoteForm {
  title: string
  content: string
  tags: Tag[]
}

interface Props {
  note?: Note | null
  tags: Tag[]
  onChange: (data: NoteForm) => void
  onBackPress: () => void
  onNewTagSubmit: (text: string) => void
}

const defaultValues: NoteForm = {
  title: '',
  content: '',
  tags: [],
}

export const NoteEditLayout: FC<Props> = ({
  onBackPress,
  onNewTagSubmit,
  onChange,
  tags,
  note,
}) => {
  const {
    control,
    formState: { isDirty },
  } = useForm<NoteForm>({
    defaultValues: {
      ...defaultValues,
      ...note?.data,
    },
  })

  const [title, content, itemTags] = useDebounceWatch({
    control,
    name: ['title', 'content', 'tags'],
    delay: 300,
  })

  useEffect(() => {
    if (!isDirty) return
    onChange({ title, content, tags: itemTags })
  }, [title, content, itemTags, isDirty, onChange])

  return (
    <SafeAreaView style={styles.container}>
      <Row style={styles.header}>
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
                  tags={tags}
                  currents={value}
                  onChange={onChange}
                  onNewTagSubmit={onNewTagSubmit}
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
                ref={ref}
                style={styles.title}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
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
            {(note?.updateAt ?? new Date()).toLocaleString()}
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
                autoCapitalize="sentences"
                multiline
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
    gap: 8,
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
  title: {
    fontSize: 24,
    fontWeight: '600',
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
