import { useNavigation } from '@react-navigation/native'
import { FC, useCallback } from 'react'
import { TagManagerLayout } from '~/components/templates'
import { useQuery, useRealm } from '~/services/database'
import { Tag } from '~/services/database/model'

export const TagManagerScreen: FC = () => {
  const reaml = useRealm()
  const tags = useQuery(Tag, tags => {
    return tags.sorted('isPinned', true)
  })
  const navigation = useNavigation()

  const handleDeleteTag = useCallback(
    (...tags: Tag[]) => {
      reaml.write(() => {
        reaml.delete(tags)
      })
    },
    [reaml],
  )

  const handleTagPress = useCallback(
    (tag: Tag) => {
      // Go back with tagId
    },
    [reaml],
  )

  const handleCreatetag = useCallback(
    (name: string) => {
      reaml.write(() => {
        reaml.create(Tag, Tag.generate({ name }))
      })
    },
    [reaml],
  )

  const handlePintag = useCallback(
    (...tags: Tag[]) => {
      reaml.write(() => {
        const hasPinned = tags.some(tag => tag.isPinned)
        if (hasPinned) {
          tags.forEach(tag => (tag.isPinned = false))
        } else {
          tags.forEach(tag => (tag.isPinned = true))
        }
      })
    },
    [reaml],
  )

  const handleUpdateTag = useCallback(
    (tag: Tag, name: string) => {
      reaml.write(() => {
        tag.name = name
      })
    },
    [reaml],
  )

  return (
    <TagManagerLayout
      tags={tags}
      onNewTag={handleCreatetag}
      onPinTag={handlePintag}
      onBackPress={navigation.goBack}
      onDeleteTag={handleDeleteTag}
      onTagPress={handleTagPress}
      onUpdateTag={handleUpdateTag}
    />
  )
}
