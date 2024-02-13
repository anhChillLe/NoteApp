import {FC, ReactElement} from 'react'
import {PaperProvider} from 'react-native-paper'

interface Props {
  children: ReactElement
}

const AppThemeProvider: FC<Props> = ({children}) => {
  return <PaperProvider>{children}</PaperProvider>
}


export default AppThemeProvider