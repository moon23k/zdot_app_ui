import { ScrollView, View } from 'react-native';
import { Photo } from '../../components/photo/photo';
import { Text } from '../../components/text/text';
import { PressableBase } from '../../internal/pressable-base';
import { makeStyles } from '../../utils/styles';

export type MockupStripItem = { key: string; label: string; uri: string };

export type MockupStripProps = {
  items: readonly MockupStripItem[];
  onPress: (key: string) => void;
};

const THUMB = 96;

const useStyles = makeStyles((t) => ({
  row: { gap: t.layout.itemGap, paddingHorizontal: t.layout.screenX },
  cell: { width: THUMB, gap: t.space[1] },
  photo: { width: THUMB },
  pressed: { opacity: t.opacity.pressed },
}));

export function MockupStrip({ items, onPress }: MockupStripProps) {
  const s = useStyles();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.row}
    >
      {items.map((item) => (
        <PressableBase
          key={item.key}
          accessibilityRole="button"
          accessibilityLabel={item.label}
          onPress={() => onPress(item.key)}
          pressedStyle={s.pressed}
          style={s.cell}
        >
          <View style={s.photo}>
            <Photo
              source={{ uri: item.uri }}
              aspectRatio={4 / 5}
              seed={item.key}
            />
          </View>
          <Text variant="caption" tone="muted" numberOfLines={1}>
            {item.label}
          </Text>
        </PressableBase>
      ))}
    </ScrollView>
  );
}
