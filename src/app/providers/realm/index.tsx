import React, { FC, ReactElement } from 'react'
import { RealmProvider } from '~/services/database'
import { Note, Style, Tag, TaskItem } from '~/services/database/model'

interface Props {
  children: ReactElement
}

export const DBProvider: FC<Props> = ({ children }) => {
  return (
    <RealmProvider schema={[Note, TaskItem, Style, Tag]}>
      {children}
    </RealmProvider>
  )
}
