import { createRealmContext } from '@realm/react'
import Realm, { Configuration } from 'realm'
import { Note, Style, Tag, TaskItem } from './model'

export const realmConfig: Configuration = {
  schema: [Tag, Note, Style, TaskItem],
  path: 'bundle.realm',
}

Realm.copyBundledRealmFiles()
const context = createRealmContext(realmConfig)
export const { RealmProvider, useObject, useQuery, useRealm } = context
