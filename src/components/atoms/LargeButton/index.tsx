import { FC, forwardRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, ButtonProps, useTheme } from 'react-native-paper'

const LargeButton = forwardRef<View, ButtonProps>(
  ({ style, labelStyle, contentStyle, ...props }, ref) => {
    const { roundness } = useTheme()
    return (
      <Button
        ref={ref}
        style={[{ borderRadius: roundness * 4 }, style]}
        labelStyle={[styles.action_label, labelStyle]}
        contentStyle={[styles.action_content, contentStyle]}
        {...props}
      />
    )
  },
)

const styles = StyleSheet.create({
  action_content: {
    padding: 6,
  },
  action_label: {
    fontSize: 16,
  },
})

export default LargeButton
