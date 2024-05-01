import { DispatchWithoutAction } from 'react'
import { Realm, Results } from 'realm'

const numericRegEx = /^-?\d+$/

function getCacheKey(id: string) {
  return `${id}`
}

type CachedCollectionArgs<T> = {
  collection: Results<T>
  realm: Realm
  updateCallback: DispatchWithoutAction
  updatedRef: React.MutableRefObject<boolean>
  objectCache?: Map<string, T>
  isDerived?: boolean
}

export type CollectionCallback = Parameters<
  typeof Results.prototype.addListener
>[0]

export function createCachedCollection<T extends Realm.Object<any>>({
  collection,
  realm,
  updateCallback,
  updatedRef,
  objectCache = new Map(),
  isDerived = false,
}: CachedCollectionArgs<T>): {
  collection: Results<T>
  tearDown: () => void
} {
  const cachedCollectionHandler: ProxyHandler<Results<T>> = {
    get: (target, key, receiver) => {
      const value = Reflect.get(target, key, receiver)
      if (typeof value === 'function') {
        if (key === 'sorted' || key === 'filtered') {
          return (...args: unknown[]) => {
            const col: Results<T> = Reflect.apply(value, target, args)
            const { collection: newCol } = createCachedCollection({
              collection: col,
              realm,
              updateCallback,
              updatedRef,
              objectCache,
              isDerived: true,
            })
            return newCol
          }
        }
        return value
      }

      // If the key is not numeric, pass it through
      if (typeof key === 'symbol' || !numericRegEx.test(key)) {
        return value
      }

      // If the key is numeric, check if we have a cached object for this key
      const index = Number(key)
      const object = target[index]

      // If the collection is modeled in a way that objects can be null
      // then we should return null instead of undefined to stay semantically
      // correct
      if (object === null) {
        return null
      } else if (typeof object === 'undefined') {
        // If there is no object at this index, return undefined
        return undefined
      }

      const objectId = object._objectKey()
      const cacheKey = getCacheKey(objectId)

      // If we do, return it...
      if (objectCache.get(cacheKey)) {
        return objectCache.get(cacheKey)
      }

      // If not then this index has either not been accessed before, or has been invalidated due
      // to a modification. Fetch it from the collection and store it in the cache
      objectCache.set(cacheKey, object)

      return object
    },
  }

  const cachedCollectionResult = new Proxy(collection, cachedCollectionHandler)

  const listenerCallback: CollectionCallback = (
    listenerCollection,
    changes,
  ) => {
    if (
      changes.deletions.length > 0 ||
      changes.insertions.length > 0 ||
      changes.newModifications.length > 0
    ) {
      // TODO: There is currently no way to rebuild the cache key from the changes array for deleted object.
      // Until it is possible, we clear the cache on deletions.
      // Blocking issue: https://github.com/realm/realm-core/issues/5220

      // Possible solutions:
      // a. the listenerCollection is a frozen copy of the collection before the deletion,
      // allowing accessing the _objectKey() using listenerCollection[index]._objectKey()
      // b. the callback provides an array of changed objectIds

      if (changes.deletions.length > 0) {
        objectCache.clear()
      }

      // Item(s) were modified, just clear them from the cache so that we return new instances for them
      changes.newModifications.forEach(index => {
        const objectId = listenerCollection[index]._objectKey()
        if (objectId) {
          const cacheKey = getCacheKey(objectId)
          if (objectCache.has(cacheKey)) {
            objectCache.delete(cacheKey)
          }
        }
      })
      updatedRef.current = true
      updateCallback()
    }
  }

  if (!isDerived) {
    // If we are in a transaction, then push adding the listener to the event loop.  This will allow the write transaction to finish.
    // see https://github.com/realm/realm-js/issues/4375
    if (realm.isInTransaction) {
      setImmediate(() => {
        collection.addListener(listenerCallback)
      })
    } else {
      collection.addListener(listenerCallback)
    }
  }

  const tearDown = () => {
    if (!isDerived) {
      collection.removeListener(listenerCallback)
      objectCache.clear()
    }
  }

  return { collection: cachedCollectionResult, tearDown }
}
