import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react'
import { Toast } from '~/components/molecules'

interface Options {
  text: string
  icon?: string
  duration?: number
  gravity?: number
}

interface Action {
  show: (options: Options) => void
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

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <Toast children={options?.text} visible={visible} onRequestClose={hide} />
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

export default ToastProvider
export { useToast }
