import { View, type StyleProp, type ViewStyle } from 'react-native';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';
import { Photo } from '../photo/photo';

export type ThumbStripProps = {
  images: readonly string[];
  onPress?: (index: number) => void;
  style?: StyleProp<ViewStyle>;
};

const SIZE = 72;

const useStyles = makeStyles((t) => ({
  root: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: t.space[1] + t.space[1] / 2,
  },
  thumb: { width: SIZE },
}));

export function ThumbStrip({ images, onPress, style }: ThumbStripProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View style={[s.root, style]}>
      {images.map((uri, index) => (
        <PressableBase
          key={`${uri}-${index}`}
          accessibilityRole="imagebutton"
          accessibilityLabel={`사진 ${index + 1}`}
          onPress={onPress ? () => onPress(index) : undefined}
        >
          <Photo source={{ uri }} radius={t.radius.md} style={s.thumb} />
        </PressableBase>
      ))}
    </View>
  );
}
