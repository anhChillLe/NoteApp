import { useState, useEffect } from 'react'
import {
  Control,
  DeepPartialSkipArrayKey,
  FieldPath,
  FieldPathValues,
  FieldValues,
  useWatch,
} from 'react-hook-form'

export function useDebounceWatch<
  TFieldValues extends FieldValues = FieldValues,
  TFieldNames extends readonly FieldPath<TFieldValues>[] = readonly FieldPath<TFieldValues>[],
>({
  control,
  name,
  defaultValue,
  delay = 300,
}: {
  name: readonly [...TFieldNames]
  control: Control<TFieldValues>
  defaultValue?: DeepPartialSkipArrayKey<TFieldValues>
  delay?: number
}): FieldPathValues<TFieldValues, TFieldNames> {
  const data = useWatch({ control, name, defaultValue })
  const [debouncedData, setDebouncedData] = useState(data)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedData(data)
    }, delay)
    return () => clearTimeout(timeout)
  }, [...data, delay])

  return debouncedData
}
