/**
 * Force rerender when adding new item from 0 or 1 item, follow this issue
 * https://github.com/Shopify/flash-list/issues/927
 */

import {
  MasonryFlashList,
  MasonryFlashListProps,
  MasonryFlashListRef,
} from '@shopify/flash-list'
import {
  ForwardedRef,
  ReactElement,
  RefObject,
  forwardRef,
  useMemo,
  useRef,
} from 'react'

interface Props<T> extends MasonryFlashListProps<T> {}

const MasonryList = <T,>(
  { data, numColumns = 1, ...props }: Props<T>,
  ref?: RefObject<MasonryFlashListRef<T>>,
): ReactElement => {
  const dataLength = data?.length ?? 0
  const isRendered = useRef(dataLength >= numColumns)

  const key = useMemo(() => {
    if (isRendered.current) {
      return 'note-list'
    } else if (dataLength >= numColumns) {
      isRendered.current = true
      return 'note-list'
    } else {
      return `note-list-${dataLength}`
    }
  }, [dataLength >= numColumns, isRendered.current, numColumns])

  return (
    <MasonryFlashList
      key={key}
      ref={ref}
      data={data}
      numColumns={numColumns}
      {...props}
    />
  )
}

const ForwardedMasonryList = forwardRef(MasonryList as never) as <T>(
  props: Props<T> & { ref?: React.Ref<MasonryFlashListRef<T>> },
) => ReactElement

export default ForwardedMasonryList
