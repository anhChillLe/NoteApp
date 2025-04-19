import notifee, {
  AndroidBadgeIconType,
  AndroidChannel,
  AndroidImportance,
  AndroidVisibility,
  Notification,
  NotificationAndroid,
  NotificationIOS,
  RepeatFrequency,
  Trigger,
  TriggerType,
} from '@notifee/react-native'
import { Note } from 'note-app-database'
import { MD3Theme } from 'react-native-chill-ui'

export namespace AppNotification {
  export const channel: AndroidChannel = {
    id: 'note',
    name: 'Note aleart',
    badge: true,
  }

  function getRepeatFrequency(mode: RepeatMode) {
    switch (mode) {
      case 'none':
        return RepeatFrequency.NONE
      case 'daily':
        return RepeatFrequency.DAILY
      case 'weekly':
        return RepeatFrequency.WEEKLY
    }
  }

  function getTimestamp(date: Date): number {
    if (date.getTime() < Date.now()) {
      return date.getTime() + 24 * 3_600_000
    }
    return date.getTime()
  }

  function getBody(item: Note) {
    if (item.type === 'note') return item.content.trim()
    return item.taskList
      .map(it => `${it.isChecked ? '◉' : '⭘'} ${it.label}`)
      .join('\n')
  }

  export async function setNoteReminder(
    item: Note,
    time: Date,
    repeatMode: RepeatMode,
    theme: MD3Theme,
  ) {
    const channelId = await notifee.createChannel(channel)

    const androidConfig: NotificationAndroid = {
      channelId,
      showTimestamp: true,
      autoCancel: true,
      pressAction: { id: 'default' },
      color: theme.colors.primary,
      smallIcon: 'ic_reminder',
      importance: AndroidImportance.HIGH,
      localOnly: true,
      visibility: item.isPrivate
        ? AndroidVisibility.PRIVATE
        : AndroidVisibility.PUBLIC,
      badgeIconType: AndroidBadgeIconType.SMALL,
    }

    const iosConfig: NotificationIOS = {
      // badgeCount: 1,
    }

    const notification: Notification = {
      id: item.id,
      title: item.title,
      body: getBody(item),
      android: androidConfig,
      ios: iosConfig,
    }

    const timestamp = getTimestamp(time)
    const repeatFrequency = getRepeatFrequency(repeatMode)
    const trigger: Trigger = {
      type: TriggerType.TIMESTAMP,
      // timestamp: __DEV__ ? new Date().getTime() + 10_000 : timestamp,
      timestamp,
      repeatFrequency,
    }

    const id = await notifee.createTriggerNotification(notification, trigger)

    return { id, timestamp }
  }
  export async function cancelNoteReminder(id: string) {
    return notifee.cancelTriggerNotification(id)
  }
}
