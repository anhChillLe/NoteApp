import React, { forwardRef } from 'react'
import { ViewProps } from 'react-native'
import { IconButton } from 'react-native-paper'
import { Row } from '~/components/atoms'

interface Props extends ViewProps {
  onBoldPress?: () => void
  onItalicPress?: () => void
  onStrikeThroughPress?: () => void
  onListPress?: () => void
  onImagePress?: () => void
}

interface Toolbar {}

export const EditorToolbar = forwardRef<Toolbar, Props>(
  (
    {
      onBoldPress,
      onImagePress,
      onItalicPress,
      onListPress,
      onStrikeThroughPress,
      ...props
    },
    ref,
  ) => {
    return (
      <Row {...props}>
        <IconButton icon="bold" size={18} onPress={onBoldPress} />
        <IconButton icon="italic" size={18} onPress={onItalicPress} />
        <IconButton
          icon="strikethrough"
          size={18}
          onPress={onStrikeThroughPress}
        />
        <IconButton icon="list" size={18} onPress={onListPress} />
        <IconButton icon="picture" size={18} onPress={onImagePress} />
      </Row>
    )
  },
)
