import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import { Realm, SortDescriptor } from 'realm'
import { useRealm } from '..'
import { Note, Tag } from '../model'
import { createCachedCollection } from './utils'

type QueryCallback<T> = (collection: Realm.Results<T>) => Realm.Results<T>

export type ChangeCallbackType = Parameters<
  typeof Realm.Results.prototype.addListener
>[0]

function getQuery<T extends Realm.Object<any>>(tag?: Tag) {
  return (collection: Realm.Results<T>) => {
    const sortDescriptor: SortDescriptor[] = [
      ['isPinned', true],
      ['updateAt', true],
    ]

    if (tag) {
      return collection.filtered('$0 IN tags', tag).sorted(sortDescriptor)
    } else {
      return collection.sorted(sortDescriptor)
    }
  }
}

export function useQuery(tag?: Tag) {
  const realm = useRealm()

  // We need to add the type to the deps, so that if the type changes, the query will be re-run.
  // This will be saved in an array which will be spread into the provided deps.
  // Create a forceRerender function for the cachedCollection to use as its updateCallback, so that
  // the cachedCollection can force the component using this hook to re-render when a change occurs.
  const [, forceRerender] = useReducer(x => x + 1, 0)
  const collectionRef = useRef<Realm.Results<Note>>()
  const updatedRef = useRef(true)

  // We want the user of this hook to be able pass in the `query` function inline (without the need to `useCallback` on it)
  // This means that the query function is unstable and will be a redefined on each render of the component where `useQuery` is used
  // Therefore we use the `deps` array to memoize the query function internally, and only use the returned `queryCallback`
  const queryCallback = useCallback<QueryCallback<Note>>(getQuery(tag), [tag])

  const queryResult = useMemo(() => {
    return queryCallback(realm.objects(Note))
  }, [realm, queryCallback])

  // Wrap the cachedObject in useMemo, so we only replace it with a new instance if `realm` or `queryResult` change
  const { collection: cachedCollection, tearDown } = useMemo(() => {
    return createCachedCollection({
      collection: queryResult,
      realm,
      updateCallback: forceRerender,
      updatedRef,
    })
  }, [realm, queryResult])

  // Invoke the tearDown of the cachedCollection when useQuery is unmounted
  useEffect(() => {
    return tearDown
  }, [tearDown])

  // This makes sure the collection has a different reference on a rerender
  // Also we are ensuring the type returned is Realm.Results, as this is known in this context
  if (updatedRef.current) {
    updatedRef.current = false
    collectionRef.current = new Proxy(cachedCollection, {})
  }

  // This will never not be defined, but the type system doesn't know that
  return collectionRef.current as Realm.Results<Note>
}
