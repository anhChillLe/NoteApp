import { FC } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Divider, HelperText, IconButton, Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Setting } from '~/components/organisms'
import { storage } from '~/services/storage'
import {
  Theme,
  blueTheme,
  greenTheme,
  redTheme,
  violetTheme,
  yellowTheme,
} from '~/styles/material3'

interface Props {
  onBackPress: () => void
}

export const SettingLayout: FC<Props> = ({ onBackPress }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <IconButton icon="angle-left" onPress={onBackPress} />
      </View>
      <ScrollView
        style={styles.scroll_container}
        contentContainerStyle={{ alignItems: 'stretch' }}
      >
        <Text variant="headlineLarge" style={styles.header_title}>
          Setting
        </Text>
        <View style={{ gap: 24 }}>
          <View style={styles.section_container}>
            <Text variant="bodyMedium" style={{ opacity: 0.6 }}>
              Account
            </Text>
            <Setting.SectionItem title="Login" currentValue="Yellow" />
            <Setting.SectionItem title="Synchronized" currentValue="Yellow" />
            <Setting.SectionItem title="Style" currentValue="Yellow" />
          </View>
          <Divider />
          <View style={styles.section_container}>
            <Text variant="bodyMedium" style={{ opacity: 0.6 }}>
              Theme
            </Text>
            <Setting.SectionItem title="Color scheme" currentValue="Yellow" />
            <Setting.SectionItem title="Font size" currentValue="Yellow" />
            <Setting.SectionItem
              title="App theme"
              currentValue="yellow"
              values={themeValues}
              onValueChange={value => {
                storage.set('app_theme', JSON.stringify(themeData[value]))
              }}
            />
          </View>
          <Divider />
          <View style={styles.section_container}>
            <Text variant="bodyMedium" style={{ opacity: 0.6 }}>
              Account
            </Text>
            <Setting.SectionItem title="Style" currentValue="Yellow" />
            <Setting.SectionItem title="Style" currentValue="Yellow" />
            <Setting.SectionItem title="Style" currentValue="Yellow" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll_container: {
    paddingHorizontal: 24,
    flex: 1,
  },
  header_title: {
    fontWeight: '600',
    paddingVertical: 24,
  },
  section_container: {
    gap: 8,
  },
  section_title: {},
})

const themeData: Record<string, Theme> = {
  yellow: yellowTheme,
  green: greenTheme,
  red: redTheme,
  blue: blueTheme,
  violet: violetTheme,
}

const themeValues = Object.keys(themeData)
