import { FC, useMemo } from 'react'
import { ScrollView, StyleProp, View, ViewProps, ViewStyle } from 'react-native'
import { Button, useTheme } from 'react-native-paper'
import { Tag } from '~/services/database/model'

export type HomeTagListData = {
  tags: Tag[]
  tag?: Tag
  onTagPress: (tag?: Tag) => void
  onTagManagerPress: () => void
}

type Props = ViewProps &
  HomeTagListData & {
    contentContainerStyle?: StyleProp<ViewStyle>
  }

export const HomeTagList: FC<Props> = ({
  tags,
  tag: currentTag,
  onTagPress,
  onTagManagerPress,
  contentContainerStyle,
  ...props
}) => {
  const theme = useTheme()
  const isEmpty = useMemo(() => tags.length === 0, [tags.length])

  return (
    <View {...props}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={contentContainerStyle}
      >
        {isEmpty ? (
          <Button
            mode="contained-tonal"
            icon="plus-small"
            onPress={onTagManagerPress}
          >
            Create tag
          </Button>
        ) : (
          <>
            <Button
              mode={!!currentTag ? 'contained-tonal' : 'contained'}
              style={{ borderRadius: theme.roundness * 2 }}
              onPress={() => onTagPress(undefined)}
            >
              All
            </Button>

            {tags.map(tag => {
              const isCurrent = currentTag
                ? tag._id.equals(currentTag._id)
                : false
              return (
                <Button
                  key={tag.id}
                  mode={isCurrent ? 'contained' : 'contained-tonal'}
                  style={{ borderRadius: theme.roundness * 2 }}
                  onPress={() => onTagPress(tag)}
                >
                  {tag.name}
                </Button>
              )
            })}
            <Button
              mode="contained-tonal"
              icon="folder"
              onPress={onTagManagerPress}
              style={{ borderRadius: theme.roundness * 2 }}
            >
              Manager
            </Button>
          </>
        )}
      </ScrollView>
    </View>
  )
}
