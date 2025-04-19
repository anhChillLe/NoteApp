import notifee, { EventType } from '@notifee/react-native'
import {
  createNavigationContainerRef,
  Route,
  Theme,
} from '@react-navigation/native'
import { Note, writeToRealm } from 'note-app-database'
import { FC, useEffect, useMemo, useState } from 'react'
import { MD3Theme, useTheme } from 'react-native-chill-ui'
import { BSON } from 'realm'
import RootNavigation from '~/navigation/root'
import BootSplash from 'react-native-bootsplash'

export const navigationRef = createNavigationContainerRef()

const AppNavigation: FC = () => {
  const navTheme = useNavigationTheme()
  const { loading, routes } = useNotifeeEvent()

  if (loading) {
    return null
  }

  return (
    <RootNavigation
      ref={navigationRef}
      theme={navTheme}
      initialState={{ routes }}
      onReady={BootSplash.hide}
    />
  )
}

export const useNavigationTheme = () => {
  const paperTheme = useTheme()
  return useMemo(() => convertTheme(paperTheme), [paperTheme])
}

const convertTheme = ({ dark, colors, fonts }: MD3Theme): Theme => {
  const fontFamily = fonts.default.fontFamily as string
  return {
    fonts: {
      regular: {
        fontFamily,
        fontWeight: '400',
      },
      medium: {
        fontFamily,
        fontWeight: '500',
      },
      bold: {
        fontFamily,
        fontWeight: '600',
      },
      heavy: {
        fontFamily,
        fontWeight: '700',
      },
    },
    dark,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.onBackground,
      border: colors.outline,
      notification: colors.error,
    },
  }
}

type RootKeys = keyof ReactNavigation.RootParamList
type Routes = Omit<Route<RootKeys>, 'key'>[]

function useNotifeeEvent() {
  const [routes, setRoutes] = useState<Routes>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    notifee
      .getInitialNotification()
      .then(initialNotification => {
        if (initialNotification) {
          const id = initialNotification.notification.id
          if (!id) return
          writeToRealm(realm => {
            const note = realm.objectForPrimaryKey(Note, new BSON.UUID(id))
            if (!note) return
            setRoutes([{ name: 'home' }, { name: 'note_view', params: { id } }])
          })
        }
        setLoading(false)
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    const unsub = notifee.onForegroundEvent(({ type, detail }) => {
      const id = detail.notification?.id
      if (!id) return
      writeToRealm(realm => {
        const note = realm.objectForPrimaryKey(Note, new BSON.UUID(id))
        if (!note) return
        if (type === EventType.PRESS) {
          navigationRef.navigate('note_view', { id })
        }
      })
    })
    return unsub
  }, [])

  return {
    loading,
    routes,
  }
}

export default AppNavigation
