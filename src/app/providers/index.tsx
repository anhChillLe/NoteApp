import {FC, ReactElement} from 'react'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import AppThemeProvider from '~/app/providers/theme'

interface Props {
  children: ReactElement
}

const AppProviders: FC<Props> = ({children}) => {
  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        {children}
      </AppThemeProvider>
    </SafeAreaProvider>
  )
}

export default AppProviders
