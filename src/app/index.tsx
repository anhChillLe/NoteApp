import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import RootStack from '~/navigation/Root'
import { RealmProvider } from '~/services/database'
import AppNavigationContainer from './providers/navigation'
import AppThemeProvider from './providers/paper'

function App() {
  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        <RealmProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <AppNavigationContainer>
              <RootStack />
            </AppNavigationContainer>
          </GestureHandlerRootView>
        </RealmProvider>
      </AppThemeProvider>
    </SafeAreaProvider>
  )
}

export default App
