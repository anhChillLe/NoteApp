import { FC } from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import {
  Divider,
  Text,
  TouchableRipple,
  TouchableRippleProps,
  useTheme,
} from 'react-native-paper'
import Animated from 'react-native-reanimated'
import { Row } from '~/components/atoms'
import { Note } from '~/services/database/model'

type Props = Omit<TouchableRippleProps, 'children'> & {
  data: Note
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
  maxLineOfTitle?: number
  maxLineOfContent?: number
}

export const NoteListItem: FC<Props> = ({
  data,
  contentContainerStyle,
  maxLineOfTitle = 1,
  maxLineOfContent = 4,
  style,
  ...props
}) => {
  const { id, title, content, updateAt, importantLevel } = data
  const { roundness, colors } = useTheme()

  return (
    <TouchableRipple
      {...props}
      style={[
        {
          borderRadius: roundness * 3,
          backgroundColor: colors.elevation.level1,
        },
        style,
      ]}
      borderless={true}
    >
      <Animated.View>
        <Animated.View style={[styles.container, contentContainerStyle]}>
          <Text variant="titleMedium" numberOfLines={maxLineOfTitle}>
            {title}
          </Text>
          <Row style={styles.date_row}>
            <Divider style={{ flex: 1 }} />
            <Text variant="labelSmall" style={styles.date_label}>
              {updateAt.toLocaleTimeString()}
            </Text>
          </Row>
          <Text variant="bodySmall" numberOfLines={maxLineOfContent}>
            {content}
          </Text>
        </Animated.View>
      </Animated.View>
    </TouchableRipple>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    padding: 12,
    gap: 6,
  },
  date_row: {
    alignItems: 'center',
    gap: 4,
  },
  date_label: {
    opacity: 0.5,
  },
})
