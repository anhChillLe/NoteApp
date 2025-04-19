import { StaticScreenProps } from '@react-navigation/native'
import { Tag, writeToRealm } from 'note-app-database'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TagInitLayout from './Layout'
import { useAppState } from '~/app/providers/appstate'

type Props = StaticScreenProps<undefined>
const TagInitScreen: FC<Props> = () => {
  const { setFirstOpen } = useAppState()

  const skip = () => setFirstOpen(false)

  const { t } = useTranslation()
  const data = t('init_tags').split(',')

  const [selecteds, setSelecteds] = useState<Set<number>>(new Set())

  const toggleItem = (_: string, index: number) => {
    setSelecteds(selecteds => {
      const newSelecteds = new Set(selecteds)
      if (selecteds.has(index)) {
        newSelecteds.delete(index)
      } else {
        newSelecteds.add(index)
      }
      return newSelecteds
    })
  }

  const submit = () => {
    const selectedItems = data.filter((_, index) => selecteds.has(index))
    writeToRealm(realm =>
      selectedItems.forEach(name =>
        Tag.create(realm, { name, isPinned: false }),
      ),
    ).then(() => setFirstOpen(false))
  }

  return (
    <TagInitLayout
      data={data}
      selecteds={selecteds}
      onSkip={skip}
      onSubmit={submit}
      onItemPress={toggleItem}
    />
  )
}

export default TagInitScreen
