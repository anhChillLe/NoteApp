import { createRealmContext } from '@realm/react'
import Realm, { Configuration } from 'realm'
import { Note, Tag, TaskItem } from './model'

const realmConfig: Configuration = {
  schema: [Tag, Note, TaskItem],
  path: 'bundle.realm',
  schemaVersion: 0,
}

Realm.copyBundledRealmFiles()
const context = createRealmContext(realmConfig)
export const { RealmProvider, useObject, useQuery, useRealm } = context
export const openRealm = () => Realm.open(realmConfig)
export async function writeToRealm<T>(callback: (realm: Realm) => T) {
  return openRealm().then(realm => realm.write(() => callback(realm)))
}
export * from './model'
export * from './utils'

import { NoteType, NoteData } from './model/Note'
export type { NoteType, NoteData }

import { TaskItemData } from './model/TaskItem'
export type { TaskItemData }
