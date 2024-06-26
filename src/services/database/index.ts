import { createRealmContext } from '@realm/react'
import Realm, { Configuration } from 'realm'
import { Note, Tag, TaskItem } from './model'

export const realmConfig: Configuration = {
  schema: [Tag, Note, TaskItem],
  path: 'bundle.realm',
}

Realm.copyBundledRealmFiles()
const context = createRealmContext(realmConfig)
export const { RealmProvider, useObject, useQuery, useRealm } = context
