import { FC } from 'react'
import { SafeAreaView } from 'react-native'
import { Text } from 'react-native-paper'

export const WelcomeScreen: FC = () => {
  


  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Welcome</Text>
    </SafeAreaView>
  )
}
