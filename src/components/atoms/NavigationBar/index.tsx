import { useNavigation } from '@react-navigation/native'
import Color from 'color'
import { FC, useEffect } from 'react'
import { Platform } from 'react-native'
import { SystemBarController } from '~/modules'

interface Props {
  backgroundColor: string
}

const NavigationBar: FC<Props> = ({ backgroundColor }) => {
  Platform.OS === 'android' &&
    useEffect(() => {
      const color = Color(backgroundColor).hex()

      const prev = SystemBarController.getNavigationBarColor()

      SystemBarController.setNavigationBarColor(color)

      return () => {
        prev && SystemBarController.setNavigationBarColor(Color(prev).hex())
      }
    }, [backgroundColor])

  return null
}

export { NavigationBar }
