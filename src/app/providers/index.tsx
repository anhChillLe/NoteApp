import { FC, ReactElement } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import AppNavigationContainer from '~/app/providers/navigation'
import AppThemeProvider from '~/app/providers/paper'
import { DBProvider } from '~/app/providers/realm'

interface Props {
  children: ReactElement
}

const AppProviders: FC<Props> = ({ children }) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppThemeProvider>
          <DBProvider>
            <AppNavigationContainer>{children}</AppNavigationContainer>
          </DBProvider>
        </AppThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

export default AppProviders
