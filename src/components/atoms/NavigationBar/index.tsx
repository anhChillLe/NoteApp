import Color from 'color'
import { FC, useEffect } from 'react'
import { Platform } from 'react-native'
import { SystemBar } from '~/modules'

interface Props {
  backgroundColor: string
}

const NavigationBar: FC<Props> = ({ backgroundColor }) => {
  Platform.OS === 'android' &&
    useEffect(() => {
      const color = Color(backgroundColor).hex()

      const prev = SystemBar.getNavigationBarColor()

      SystemBar.setNavigationBarColor(color)

      return () => {
        prev && SystemBar.setNavigationBarColor(Color(prev).hex())
      }
    }, [backgroundColor])

  return null
}

export { NavigationBar }
