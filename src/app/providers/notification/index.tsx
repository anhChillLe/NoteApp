import notifee, {
  AuthorizationStatus,
  EventType,
  RepeatFrequency,
  TriggerNotification,
  TriggerType,
} from '@notifee/react-native'
import {
  createContext,
  FC,
  PropsWithChildren,
  use,
  useCallback,
  useEffect,
} from 'react'
import { AppState, Linking, Platform } from 'react-native'
import { useMMKVBoolean, useMMKVObject } from 'react-native-mmkv'
import { AppNotification } from '~/services/notification'
import { storage } from '~/services/storage'

export interface Reminder {
  timestamp: Date
  repeatMode: RepeatMode
}

interface NotificationContextValue {
  notifications: TriggerNotification[]
  load: () => void
  checkPermission: () => Promise<boolean>
  requestPermission: () => void
  getTriggerById: (id: string) => Reminder | null
}

const NotificationContext = createContext<NotificationContextValue>(
  {} as NotificationContextValue,
)

const NotificationProvider: FC<PropsWithChildren> = ({ children }) => {
  const [hasPermission, setHasPermission] = useMMKVBoolean('hasPermission')
  const [isRequested, setIsRequested] = useMMKVBoolean('isRequested')
  const [isChannelBlocked, setIsChannelBlocked] =
    useMMKVBoolean('isChannelBlocked')
  const [notifications, setNotifications] =
    useMMKVObject<TriggerNotification[]>('notifications')

  const checkPermission = useCallback(async () => {
    const { authorizationStatus } = await notifee.getNotificationSettings()
    const isBlocked = await notifee.isChannelBlocked(AppNotification.channel.id)
    const hasAuthor = authorizationStatus === AuthorizationStatus.AUTHORIZED
    setHasPermission(hasAuthor)
    setIsChannelBlocked(isBlocked)
    return hasAuthor && !isBlocked
  }, [setHasPermission, setIsChannelBlocked])

  const requestPermission = useCallback(() => {
    if (isRequested) {
      Platform.select({
        ios: Linking.openSettings(),
        android: notifee.openNotificationSettings(),
      })
    } else {
      notifee
        .requestPermission()
        .then(({ authorizationStatus }) => {
          if (authorizationStatus === AuthorizationStatus.AUTHORIZED) {
            setHasPermission(true)
          } else {
            setHasPermission(false)
            setIsRequested(true)
          }
        })
        .catch(console.log)
    }
  }, [isRequested, setHasPermission, setIsRequested])

  const load = useCallback(() => {
    notifee.getTriggerNotifications().then(setNotifications)
  }, [setNotifications])

  const getTriggerById = (id: String) => {
    const notification = notifications?.find(it => it.notification.id === id)
    const trigger = notification?.trigger
    if (!trigger || trigger.type === TriggerType.INTERVAL) return null
    const { timestamp, repeatFrequency } = trigger
    const repeatMode = repeatMap[repeatFrequency ?? RepeatFrequency.NONE]
    return {
      timestamp: new Date(timestamp),
      repeatMode,
    }
  }

  useEffect(() => {
    load()
    checkPermission()
    const unsub = notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.DELIVERED:
          load()
          break
        case EventType.APP_BLOCKED:
          setHasPermission(false)
          break
        case EventType.CHANNEL_BLOCKED:
          if (AppNotification.channel.id === detail.channel?.id) {
            setIsChannelBlocked(false)
          }
          break
        case EventType.CHANNEL_GROUP_BLOCKED:
          if (AppNotification.channel.id === detail.channel?.id) {
            setIsChannelBlocked(false)
          }
          break
        case EventType.TRIGGER_NOTIFICATION_CREATED:
          load()
          break
        default:
          break
      }
    })
    return unsub
  }, [checkPermission, load, setIsChannelBlocked, setHasPermission])

  useEffect(() => {
    if (Platform.OS === 'ios') {
      AppState.addEventListener('change', checkPermission)
    }
  }, [checkPermission])

  useMigration()

  return (
    <NotificationContext.Provider
      value={{
        notifications: notifications ?? [],
        load,
        checkPermission,
        requestPermission,
        getTriggerById,
      }}
      children={children}
    />
  )
}

const repeatMap: Record<RepeatFrequency, RepeatMode> = {
  [RepeatFrequency.NONE]: 'none',
  [RepeatFrequency.HOURLY]: 'none',
  [RepeatFrequency.DAILY]: 'daily',
  [RepeatFrequency.WEEKLY]: 'weekly',
}

const useReminder = () => use(NotificationContext)

type ReminderState = {
  hasPermission: boolean
  isChannelBlocked: boolean
  isRequested: boolean
  notifications: TriggerNotification[]
  load: () => void
  checkPermission: () => Promise<boolean>
  requestPermission: () => void
  setPermission: (hasPermission: boolean) => void
  setChannelStatus: (hasPermission: boolean) => void
  getTriggerById: (id: string) => Reminder | null
}

type ReminderStore = {
  state: ReminderState
  version: number
}

const useMigration = () => {
  useEffect(() => {
    const isMigrated = storage.getBoolean('isMigrated-reminder')
    const zustandStoreStr = storage.getString('reminder-storage')

    if (!isMigrated && zustandStoreStr) {
      const zustandStoreValue: ReminderStore = JSON.parse(zustandStoreStr)
      const hasPermission = zustandStoreValue.state.hasPermission
      const isChannelBlocked = zustandStoreValue.state.isChannelBlocked
      const isRequested = zustandStoreValue.state.isRequested
      const notifications = zustandStoreValue.state.notifications

      storage.set('hasPermission', hasPermission)
      storage.set('isRequested', isRequested)
      storage.set('isChannelBlocked', isChannelBlocked)
      storage.set('notifications', JSON.stringify(notifications))

      storage.delete('reminder-storage')

      storage.set('isMigrated-reminder', true)
    }
  }, [])
}

export default NotificationProvider
export { useReminder }
