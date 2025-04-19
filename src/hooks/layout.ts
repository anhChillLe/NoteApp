import { useState, useCallback } from 'react'
import { LayoutRectangle, LayoutChangeEvent } from 'react-native'

function useLayout(
  initLayout?: undefined,
): [LayoutRectangle | undefined, (e: LayoutChangeEvent) => void]

function useLayout(
  initLayout: LayoutRectangle,
): [LayoutRectangle, (e: LayoutChangeEvent) => void]

function useLayout(
  initLayout?: LayoutRectangle,
): [LayoutRectangle | undefined, (e: LayoutChangeEvent) => void] {
  const [layout, setLayout] = useState<LayoutRectangle | undefined>(initLayout)

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      setLayout(e.nativeEvent.layout)
    },
    [setLayout],
  )
  return [layout, handleLayout]
}

export default useLayout
