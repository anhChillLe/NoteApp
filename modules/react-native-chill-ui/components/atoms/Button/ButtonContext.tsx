import { createContext, useContext } from 'react'
import { ButtonMode, ButtonSize } from './ButtonType'

interface ButtonContext {
  mode: ButtonMode
  size: ButtonSize
}

const ButtonContext = createContext<ButtonContext>(null as never)
const useButton = () => useContext(ButtonContext)

export { useButton }
export default ButtonContext
