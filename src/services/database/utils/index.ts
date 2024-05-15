import { Results } from 'realm'

type Query<T> = (collection: Results<T>) => Results<T>

function combineQuery<T>(...queries: Query<T>[]) {
  return (collection: Results<T>) => {
    return queries.reduce((accumulation, query) => {
      return query(accumulation)
    }, collection)
  }
}

export type { Query }
export { combineQuery }
