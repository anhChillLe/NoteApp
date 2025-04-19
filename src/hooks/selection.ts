import { useEffect, useState } from 'react'

function useSelection<K = string, T extends { id: K } = { id: K }>(
  isActive: boolean,
) {
  const [selecteds, setSelecteds] = useState<Set<K> | 'all'>(new Set())

  const select = (item: T) => {
    setSelecteds(prev => {
      if (prev === 'all') return prev
      const newSet = new Set(prev)
      if (newSet.has(item.id)) {
        newSet.delete(item.id)
      } else {
        newSet.add(item.id)
      }
      return newSet
    })
  }

  const selectAll = () => {
    setSelecteds(prev => {
      if (prev === 'all') {
        return new Set()
      }
      return 'all'
    })
  }

  useEffect(() => {
    if (!isActive) {
      setSelecteds(new Set())
    }
  }, [isActive])

  return [selecteds, select, selectAll] as const
}

export default useSelection
