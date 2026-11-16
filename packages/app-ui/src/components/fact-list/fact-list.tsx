import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { CheckGlyph } from '../../internal/glyphs';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type Fact = { label: string; met: boolean | null };

export type FactListProps = {
  items: readonly Fact[];
  style?: StyleProp<ViewStyle>;
};

const ICON = 14;
const LINE = 10;

const useStyles = makeStyles((t) => ({
  root: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: t.space[3],
    rowGap: t.space[1],
  },
  item: { flexDirection: 'row', alignItems: 'center', gap: t.space[1] },
  label: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.eyebrow.fontSize,
    lineHeight: t.typography.eyebrow.lineHeight,
    color: t.colors.foreground,
  },
  muted: { color: t.colors.mutedForeground },
  dash: { width: ICON, alignItems: 'center' },
  dashLine: {
    width: LINE,
    height: 1.5,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.mutedForeground,
  },
}));

export function FactList({ items, style }: FactListProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View style={[s.root, style]}>
      {items.map((item) => (
        <View
          key={item.label}
          style={s.item}
          accessible
          accessibilityLabel={`${item.label} ${item.met === null ? '확인 필요' : item.met ? '충족' : '미충족'}`}
        >
          {item.met === true ? (
            <CheckGlyph color={t.colors.success} size={ICON} />
          ) : item.met === false ? (
            <View style={s.dash}>
              <View style={s.dashLine} />
            </View>
          ) : null}
          <Text style={[s.label, item.met !== true && s.muted]}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
