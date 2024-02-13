import {SafeAreaView, StyleSheet} from 'react-native'
import AppButton from '~/components/atoms/button'

export default function App() {
  return (
    <SafeAreaView style={[styles.screen, styles.center]}>
      <AppButton />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 8,
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
