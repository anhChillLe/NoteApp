import { RealmProvider } from 'note-app-database'
import { Portal, ToastProvider } from 'react-native-chill-ui'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import LanguageProvider from './providers/language'
import AppNavigation from './providers/navigation'
import NotificationProvider from './providers/notification'
import AppThemeProvider from './providers/theme'
import AppStateProvider from './providers/appstate'
import SettingProvider from '~/app/providers/settings'

function App() {
  return (
    <AppStateProvider>
      <SettingProvider>
        <NotificationProvider>
          <LanguageProvider>
            <RealmProvider>
              <SafeAreaProvider>
                <GestureHandlerRootView>
                  <AppThemeProvider>
                    <Portal.Host>
                      <ToastProvider>
                        <AppNavigation />
                      </ToastProvider>
                    </Portal.Host>
                  </AppThemeProvider>
                </GestureHandlerRootView>
              </SafeAreaProvider>
            </RealmProvider>
          </LanguageProvider>
        </NotificationProvider>
      </SettingProvider>
    </AppStateProvider>
  )
}

export default App
