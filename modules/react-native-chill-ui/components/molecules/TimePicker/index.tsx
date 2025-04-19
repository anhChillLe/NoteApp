import { FC, useMemo, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { Picker, Text } from '../../atoms'
import { t } from 'i18next'

interface TimePickerProps {
  init?: Date
  showSeconds?: boolean
  onChange?: (time: { hour: number; minute: number; second: number }) => void
}

const numArray = (max: number) => Array.from({ length: max }, (_, i) => i)

const TimePicker: FC<TimePickerProps> = ({
  init,
  showSeconds = false,
  onChange = () => {},
}) => {
  const now = useMemo(() => init ?? new Date(), [])
  const hourRef = useRef(now.getHours())
  const minuteRef = useRef(now.getMinutes())
  const secondRef = useRef(now.getSeconds())

  const setHour = (hour: number) => {
    hourRef.current = hour
    onChange({ hour, minute: minuteRef.current, second: secondRef.current })
  }

  const setMinute = (minute: number) => {
    minuteRef.current = minute
    onChange({ hour: hourRef.current, minute, second: secondRef.current })
  }

  const setSecond = (second: number) => {
    secondRef.current = second
    onChange({ hour: hourRef.current, minute: minuteRef.current, second })
  }

  return (
    <View style={styles.container}>
      <Picker data={numArray(24)} init={now.getHours()} onChange={setHour} />
      <Text style={styles.spread} variant="headlineLarge" children={':'} />
      <Picker
        data={numArray(60)}
        init={now.getMinutes()}
        onChange={setMinute}
      />
      {showSeconds && (
        <>
          <Text style={styles.spread} variant="headlineLarge" children={':'} />
          <Picker
            data={numArray(60)}
            init={now.getSeconds()}
            onChange={setSecond}
          />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  spread: {
    fontWeight: 'bold',
  },
})

export default TimePicker
export type { TimePickerProps }
