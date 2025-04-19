import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, View } from 'react-native'
import {
  Button,
  Dialog,
  Icon,
  Menu,
  Section,
  Text,
  TimePicker,
  useTheme,
} from 'react-native-chill-ui'
import {
  FadeInDown,
  LinearTransition,
  useAnimatedRef,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AnimatedShape } from '~/components'
import { useVisible } from '~/hooks'
import { useSetReminder } from './Provider'
import { useReminder } from '~/app/providers/notification'

const SetReminderLayout: FC = () => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const {
    goBack,
    setReminder,
    data: { id },
  } = useSetReminder()
  const { getTriggerById, requestPermission } = useReminder()
  const hasReminder = getTriggerById(id)
  const [visible, show, hide] = useVisible()
  const submit = () => setReminder(show)

  return (
    <>
      <SafeAreaView
        style={styles.container}
        accessibilityViewIsModal
        accessibilityLiveRegion="polite"
      >
        <Pressable
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: colors.backdrop },
          ]}
          onPress={goBack}
          accessibilityLabel={t('go_back')}
          accessibilityRole="button"
          importantForAccessibility="no"
        />
        <AnimatedShape
          style={styles.content}
          roundnessLevel={5}
          entering={FadeInDown}
          layout={LinearTransition}
        >
          <View style={{ gap: 8 }}>
            <Header />
            <ReminderTimePicker />
            {hasReminder && <CurrentReminder />}
            <RepeatModePicker />
            <View style={styles.action_container}>
              <Button mode="outlined" onPress={goBack} title={t('cancel')} />
              <Button
                mode="contained"
                onPress={submit}
                title={t(hasReminder ? 'change' : 'set')}
              />
            </View>
          </View>
        </AnimatedShape>
      </SafeAreaView>
      <Dialog
        visible={visible}
        dismissable
        dismissableBackButton
        onRequestClose={hide}
      >
        <Dialog.Content>
          <View style={styles.dialog}>
            <Icon name="notifications-outline" size={24} />
            <Text
              variant="titleLarge"
              style={styles.dialog_title}
              children={t('require_permission_description')}
            />
            <Button
              mode="contained"
              title={t('grant')}
              onPress={() => {
                requestPermission()
                hide()
              }}
            />
          </View>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
const CurrentReminder: FC = () => {
  const { colors, roundness } = useTheme()
  const { t } = useTranslation()
  const {
    data: { id },
    cancelReminder,
  } = useSetReminder()
  const { getTriggerById } = useReminder()
  const trigger = getTriggerById(id)

  return (
    <View
      style={[
        styles.current_reminder,
        {
          borderRadius: roundness * 3,
          backgroundColor: colors.surfaceContainerLow,
        },
      ]}
    >
      <Text
        variant="bodyMedium"
        children={t('date_time', { value: trigger?.timestamp })}
      />
      <Button onPress={cancelReminder} testID={t('turn_off')} />
    </View>
  )
}

const Header: FC = () => {
  const { t } = useTranslation()
  const { time } = useSetReminder()

  const distance = (() => {
    const disFromNow = time.getTime() - Date.now()
    if (disFromNow > 0) return disFromNow
    return disFromNow + 24 * 3_600_000
  })()

  return (
    <View style={styles.header}>
      <Text children={t('notify_after', { value: distance })} />
    </View>
  )
}

const ReminderTimePicker: FC = () => {
  const { time, setTime } = useSetReminder()

  return (
    <TimePicker
      init={time}
      onChange={({ hour, minute, second }) => {
        const cloned = new Date(time)

        cloned.setHours(hour)
        cloned.setMinutes(minute)
        cloned.setSeconds(second)

        setTime(cloned)
      }}
    />
  )
}

const modes: RepeatMode[] = ['none', 'daily', 'weekly']

const RepeatModePicker: FC = () => {
  const { t } = useTranslation()
  const ref = useAnimatedRef<View>()
  const { repeatMode, setRepeatMode } = useSetReminder()
  const [visible, show, hide] = useVisible()

  return (
    <>
      <Section.Item
        title={t('repeat')}
        value={t('repeat_mode', { mode: repeatMode })}
        valueRef={ref}
        onPress={show}
      />
      <Menu visible={visible} onRequestClose={hide} anchorRef={ref}>
        {modes.map(mode => {
          const toggle = () => setRepeatMode(mode)
          return (
            <Menu.SelectItem
              key={mode}
              title={t('repeat_mode', { mode })}
              isSelected={mode === repeatMode}
              onPress={toggle}
            />
          )
        })}
      </Menu>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    padding: 4,
  },
  content: {
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 16,
  },
  action_container: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'flex-end',
  },
  date_picker_action: {
    flexDirection: 'row',
    gap: 16,
    padding: 8,
    marginTop: 16,
  },
  action: {
    flex: 1,
  },
  dialog: {
    alignItems: 'center',
    gap: 16,
    paddingVertical: 4,
  },
  dialog_title: {
    textAlign: 'center',
  },
  current_reminder: {
    paddingLeft: 24,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

export default SetReminderLayout
