import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { IconName } from '../../atoms/Icon'
import { Toast } from '../../molecules'

interface Options {
  text: string
  icon?: IconName
  duration?: number
  gravity?: number
}

interface Action {
  show: (options: Options) => void
  hide: () => void
}

const ToastContext = createContext<Action>(null as never)

const ToastProvider: FC<PropsWithChildren> = ({ children }) => {
  const [visible, setVisible] = useState(false)
  const [options, setOptions] = useState<Options>()

  const show = useCallback(
    (options: Options) => {
      setVisible(true)
      setOptions(options)
    },
    [setVisible, setOptions],
  )

  const hide = useCallback(() => {
    setVisible(false)
  }, [setVisible])

  const value = useMemo(() => ({ show, hide }), [show, hide])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast
        children={options?.text.trim()}
        visible={visible}
        onRequestClose={hide}
        gravity={options?.gravity}
      />
    </ToastContext.Provider>
  )
}

const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('ToastProvider is not provided')
  }
  return context
}

export { ToastProvider, useToast }
