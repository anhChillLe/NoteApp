import { createRealmContext } from '@realm/react'
import Realm, { Configuration } from 'realm'
import { Note, Style, Tag, Task, TaskItem } from './model'
import { createUseQuery } from '@realm/react/dist/useQuery'

export const realmConfig: Configuration = {
  schema: [Tag, Note, Style, Task, TaskItem],
  path: 'bundle.realm',
}

Realm.copyBundledRealmFiles()
const context = createRealmContext(realmConfig)
export const { RealmProvider, useObject, useQuery, useRealm } = context
