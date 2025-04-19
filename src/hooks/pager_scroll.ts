import { useEvent, useHandler } from 'react-native-reanimated'

export function useAnimatedPagerScrollHandler(
  handlers: any,
  dependencies?: any,
) {
  const { context, doDependenciesDiffer } = useHandler(handlers, dependencies)

  return useEvent(
    event => {
      'worklet'
      const { onPageScroll } = handlers
      if (onPageScroll && event.eventName.endsWith('onPageScroll')) {
        onPageScroll(event, context)
      }
    },
    ['onPageScroll'],
    doDependenciesDiffer,
  )
}
