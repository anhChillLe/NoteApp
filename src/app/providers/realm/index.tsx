import { RealmProvider } from '@realm/react'
import React, { FC, ReactElement } from 'react'
import { Note, Style, Tag, Task, TaskItem } from '~/services/database/model'

interface Props {
  children: ReactElement
}

export const DBProvider: FC<Props> = ({ children }) => {
  return <RealmProvider schema={[Note, Task, TaskItem, Style, Tag]}>{children}</RealmProvider>
}
