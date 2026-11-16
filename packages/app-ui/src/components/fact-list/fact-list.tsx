import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type Fact = { label: string; met: boolean | null };

export type FactListProps = {
  items: readonly Fact[];
  style?: StyleProp<ViewStyle>;
};

const useStyles = makeStyles((t) => ({
  line: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.label.fontSize,
    lineHeight: t.typography.label.lineHeight,
    color: t.colors.mutedForeground,
  },
  off: { color: t.colors.ring },
}));

export function FactList({ items, style }: FactListProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View style={style}>
      <Text
        style={s.line}
        maxFontSizeMultiplier={t.maxFontScale}
        accessibilityLabel={items
          .map(
            (item) =>
              `${item.label} ${item.met === null ? '확인 필요' : item.met ? '충족' : '미충족'}`
          )
          .join(', ')}
      >
        {items.map((item, i) => (
          <Text key={item.label} style={item.met !== true && s.off}>
            {i ? ' · ' : ''}
            {item.label}
          </Text>
        ))}
      </Text>
    </View>
  );
}
