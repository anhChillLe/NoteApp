import { Tag } from '../model'

export const queryByTag = <T>(
  collection: Realm.Results<T>,
  tag?: Tag | null,
) => {
  return tag === undefined ? collection : collection.filtered('tag == $0', tag)
}
