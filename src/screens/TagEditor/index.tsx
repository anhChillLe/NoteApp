import { StaticScreenProps, useNavigation } from '@react-navigation/native'
import { Tag, useObject, writeToRealm } from 'note-app-database'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native'
import { Button, Shape, Text, TextField, useTheme } from 'react-native-chill-ui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BSON } from 'realm'
import { AnimatedPressable } from '~/components'
import { Haptick } from '~/services/haptick'

type Props = StaticScreenProps<{ id: string } | undefined>

const TagEditorScreen: FC<Props> = ({ route }) => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const tag = useObject({
    type: Tag,
    primaryKey: new BSON.UUID(route.params?.id),
  })
  const insets = useSafeAreaInsets()
  const { colors } = useTheme()
  const [text, setText] = useState(tag?.name ?? '')

  const handleCancelPress = () => {
    navigation.goBack()
    Haptick.light()
  }

  const handleSubmitPress = () => {
    if (tag) {
      writeToRealm(() => {
        // eslint-disable-next-line react-compiler/react-compiler
        tag.name = text
      })
    } else {
      writeToRealm(realm => Tag.create(realm, { name: text, isPinned: false }))
    }

    Haptick.light()
    navigation.goBack()
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          backgroundColor: colors.backdrop,
        },
      ]}
      accessibilityViewIsModal
      accessibilityLiveRegion="polite"
    >
      <AnimatedPressable
        style={StyleSheet.absoluteFill}
        onPress={navigation.goBack}
        accessibilityLabel={t('go_back')}
        accessibilityRole="button"
        importantForAccessibility="no"
      />
      <KeyboardAvoidingView
        style={styles.content_container}
        behavior="padding"
        pointerEvents="box-none"
        keyboardVerticalOffset={16}
      >
        <Shape style={styles.input_box} roundnessLevel={4}>
          <Text
            variant="titleLarge"
            style={styles.title}
            children={t('create_tag')}
          />
          <TextField
            mode="outlined"
            placeholder={t('tag_name')}
            value={text}
            onChangeText={setText}
            autoFocus
          />
          <View style={styles.action_container}>
            <Button
              mode="outlined"
              size="small"
              style={styles.action}
              onPress={handleCancelPress}
              title={t('cancel')}
            />
            <Button
              mode="contained"
              size="small"
              style={styles.action}
              onPress={handleSubmitPress}
              title={t('ok')}
            />
          </View>
        </Shape>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
  },
  action_container: {
    flexDirection: 'row',
    gap: 8,
  },
  action: {
    flex: 1,
  },
  content_container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  input_box: {
    marginHorizontal: 16,
    gap: 16,
    padding: 16,
  },
})

export default TagEditorScreen
