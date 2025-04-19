import { useCallback, useState } from 'react'

export function useVisible(
  init: boolean = false,
): [boolean, () => void, () => void, () => void] {
  const [visible, setVisile] = useState(init)

  const show = useCallback(() => {
    setVisile(true)
  }, [setVisile])

  const hide = useCallback(() => {
    setVisile(false)
  }, [setVisile])

  const toggle = useCallback(() => {
    setVisile(it => !it)
  }, [setVisile])

  return [visible, show, hide, toggle]
}
