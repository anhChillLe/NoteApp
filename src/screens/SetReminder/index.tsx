import { StaticScreenProps, useNavigation } from '@react-navigation/native'
import { Note, useObject } from 'note-app-database'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme, useToast } from 'react-native-chill-ui'
import { BSON } from 'realm'
import { useReminder } from '~/app/providers/notification'
import { AppNotification } from '~/services/notification'
import SetReminderLayout from './Layout'
import { SetReminderProvider } from './Provider'

type Props = StaticScreenProps<{ id: string }>
const SetReminderScreen: FC<Props> = ({ route }) => {
  const { t } = useTranslation()
  const { goBack } = useNavigation()
  const note = useObject({
    type: Note,
    primaryKey: new BSON.UUID(route.params.id),
  })

  const [repeatMode, setRepeatMode] = useState<RepeatMode>('none')
  const { getTriggerById, checkPermission, load } = useReminder()
  const reminder = getTriggerById(route.params.id)

  const [time, setTime] = useState(reminder?.timestamp ?? new Date())
  const theme = useTheme()
  const toast = useToast()

  const setReminder = (onNoPermission: () => void) => {
    if (!note) return
    checkPermission().then(isAvailable => {
      if (isAvailable) {
        AppNotification.setNoteReminder(note, time, repeatMode, theme).then(
          ({ timestamp }) => {
            const distance = timestamp - Date.now()
            toast.show({
              text: t('notify_send_after', { value: distance }),
            })
            goBack()
          },
        )
      } else onNoPermission()
    })
  }

  const cancelReminder = () => {
    AppNotification.cancelNoteReminder(route.params.id).then(load)
  }

  if (note === null) {
    goBack()
    return null
  }

  return (
    <SetReminderProvider
      value={{
        data: note,
        repeatMode,
        time,
        goBack,
        setReminder,
        cancelReminder,
        setRepeatMode,
        setTime,
      }}
    >
      <SetReminderLayout />
    </SetReminderProvider>
  )
}

export default SetReminderScreen
