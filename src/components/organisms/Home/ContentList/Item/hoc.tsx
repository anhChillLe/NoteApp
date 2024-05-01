import { Attributes, ComponentType, FC } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { useHomeTagDetector } from './hook'

interface Props {
  style?: StyleProp<ViewStyle>
}

type Result<T> = Attributes &
  T & {
    onDragIn: () => void
  }

type ResultType<T extends Props> = FC<Result<T>>

function withTagDetector<T extends Props>(WrappedComponent: ComponentType<T>) {
  const DetectorTagItem: ResultType<T> = ({ style, onDragIn, ...props }) => {
    const { ref, itemStyle } = useHomeTagDetector(onDragIn)

    const combinedProps = {
      ref: ref,
      style: [style, itemStyle],
      ...(props as unknown as T),
    }

    return <WrappedComponent {...combinedProps} />
  }

  return DetectorTagItem
}

export default withTagDetector
