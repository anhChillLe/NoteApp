import { FC, useState } from 'react'
import { StyleSheet } from 'react-native'
import { FAB, Text } from 'react-native-paper'
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated'
import { AnimatedScrollView } from 'react-native-reanimated/lib/typescript/reanimated2/component/ScrollView'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Switch } from '~/components/atoms'
import { Section } from '~/components/molecules'
import { Appbar } from '~/components/organisms'
import { usePrivateNavigation } from '~/navigation/Private'
import usePrivate from '../store'

const PrivateSettingScreen: FC = () => {
  const navigation = usePrivateNavigation()
  const content = useAnimatedRef<AnimatedScrollView>()

  const scrollY = useScrollViewOffset(content)

  const appbarTitleStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, HEADER_HEIGHT], [0, 1]),
    }
  }, [])

  const headerTitlerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, HEADER_HEIGHT], [1, 0]),
    }
  }, [])

  const hasBiometric = usePrivate(state => state.hasBiometric)
  const isUsePassword = usePrivate(state => state.isUsePassword)
  const addBiometric = usePrivate(state => state.addBiometric)
  const clearPassword = usePrivate(state => state.clearPassword)
  const removeBiometric = usePrivate(state => state.removeBiometric)

  const openChangePassword = () => {
    navigation.navigate('change_password')
  }

  const openCreatePassword = () => {
    navigation.navigate('create_password')
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar
        onBackPress={navigation.goBack}
        titleStyle={appbarTitleStyle}
        title="Private settings"
      />
      <Animated.ScrollView ref={content} contentContainerStyle={styles.content}>
        <Animated.View style={[styles.header, headerTitlerStyle]}>
          <Text variant="displayMedium" children="Private settings" />
        </Animated.View>
        <Section
          title="Use password"
          description="Require password each time you access private space."
          value={isUsePassword}
          onPress={isUsePassword ? clearPassword : openCreatePassword}
        />
        <Section
          title="Use biometrics"
          description="Use biometrics to access private space instead of password."
          value={hasBiometric}
          onPress={hasBiometric ? removeBiometric : addBiometric}
          disabled={!isUsePassword}
        />
        <Section
          title="Change password"
          onPress={openChangePassword}
          disabled={!isUsePassword}
        />
      </Animated.ScrollView>
    </SafeAreaView>
  )
}

const HEADER_HEIGHT: number = 96

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'stretch',
  },
  header: {
    paddingHorizontal: 16,
    height: HEADER_HEIGHT,
    justifyContent: 'center',
  },
  section_container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
    padding: 16,
  },
  section_left: {
    flex: 1,
    flexDirection: 'column',
  },
})

export default PrivateSettingScreen
