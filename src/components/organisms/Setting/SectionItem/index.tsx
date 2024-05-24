import { useState } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { List, ListItemProps, Text, useTheme } from 'react-native-paper'
import { ActionSheet } from '~/components/atoms'

interface Props<T extends { toString: () => string }> extends ListItemProps {
  currentValue?: T
  values?: T[]
  onValueChange?: (value: T) => void
}

export function SettingSectionItem<T extends { toString: () => string }>({
  currentValue,
  values,
  onValueChange,
  ...props
}: Props<T>) {
  const { colors, roundness } = useTheme()
  const [visible, setVisible] = useState(false)

  const show = () => {
    setVisible(true)
  }
  const hide = () => {
    setVisible(false)
  }

  return (
    <>
      <List.Item
        description={currentValue?.toString()}
        right={() => <List.Icon icon="angle-right" />}
        onPress={show}
        {...props}
      />

      <ActionSheet
        visible={visible}
        onDismiss={hide}
        onRequestClose={hide}
        style={[styles.sheet, { borderRadius: roundness * 3 }]}
      >
        {values?.map(value => {
          const isSelected = value === currentValue
          const onPress = () => onValueChange?.(value)
          return (
            <Pressable
              key={value.toString()}
              style={{
                padding: 8,
                borderRadius: roundness * 2,
                backgroundColor: isSelected
                  ? colors.surfaceVariant
                  : colors.background,
              }}
              onPress={onPress}
            >
              <Text
                style={{
                  color: isSelected
                    ? colors.onSurfaceVariant
                    : colors.onBackground,
                }}
              >
                {value.toString()}
              </Text>
            </Pressable>
          )
        })}
      </ActionSheet>
    </>
  )
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  sheet: {
    margin: 16,
    padding: 16,
  },
})
