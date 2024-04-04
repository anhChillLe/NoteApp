import { FC, useCallback, useState } from 'react'
import { TagInitLayout } from '~/components/templates'
import { useRealm } from '~/services/database'
import { Tag } from '~/services/database/model'
import { storage } from '~/services/storage'
import { Key } from '~/services/storage/keys'

export const TagSelectScreen: FC = () => {
  const reaml = useRealm()

  const handleSkip = useCallback(() => {
    storage.set(Key.hasOpened, true)
  }, [])

  const handleSubmit = useCallback((tags: any[]) => {
    const selectedTags = tags.filter(it => it.isSelected)
    if (selectedTags.length == 0) return

    reaml.write(() => {
      selectedTags.forEach(tag => {
        reaml.create(Tag, Tag.generate({ name: tag.name, isPinned: true }))
      })
    })
    storage.set(Key.hasOpened, true)
  }, [])

  return <TagInitLayout onSkip={handleSkip} onSubmit={handleSubmit} />
}
