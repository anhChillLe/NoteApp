import { useCallback, useState } from 'react'

type SelectionController<T> = {
  enable: () => void
  disable: () => void
  select: (item: T) => void
  set: (items: T[]) => void
}

export function useSelection<T>(
  comparator: Compatator<T> = defaultComparator,
): [boolean, T[], SelectionController<T>] {
  const [isInSelectionMode, setIsInSelectionMode] = useState(false)
  const [selecteds, setSelecteds] = useState<T[]>([])

  const select = useCallback((item: T) => {
    setSelecteds(selecteds => {
      const newSelecteds = selecteds.filter(it => !comparator(it, item))
      return newSelecteds.length === selecteds.length
        ? [...selecteds, item]
        : newSelecteds
    })
  }, [])

  const set = useCallback(
    (items: T[]) => {
      setSelecteds(items)
    },
    [setSelecteds],
  )

  const enable = useCallback(() => {
    setIsInSelectionMode(true)
  }, [setIsInSelectionMode])

  const disable = useCallback(() => {
    setIsInSelectionMode(false)
    setSelecteds([])
  }, [setIsInSelectionMode, setSelecteds])

  return [
    isInSelectionMode,
    selecteds,
    { enable, disable, select: select, set },
  ]
}

type Compatator<T> = (t1: T, t2: T) => boolean

const defaultComparator = <T>(t1: T, t2: T) => {
  return t1 === t2
}
