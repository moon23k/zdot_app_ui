import { View } from 'react-native';
import { Text } from '../../components/text/text';
import { CheckGlyph } from '../../internal/glyphs';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type ColorChip = {
  key: string;
  color: string;
  name: string;
  code: string;
};

export type ColorChipGridProps = {
  items: readonly ColorChip[];
  value: string | null;
  onValueChange: (key: string) => void;
};

const COLUMNS = 2;
const FACE = 92;
const MARK = 24;
const CHECK = 14;
const RING = 2;

const useStyles = makeStyles((t) => ({
  grid: { gap: t.space[3] },
  row: { flexDirection: 'row', gap: t.space[2] },
  cell: { flex: 1 },
  chip: {
    overflow: 'hidden',
    borderRadius: t.radius.lg,
    borderWidth: 1,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
  },
  face: { height: FACE },
  mark: {
    position: 'absolute',
    top: t.space[2],
    right: t.space[2],
    width: MARK,
    height: MARK,
    borderRadius: t.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.primary,
  },
  label: {
    paddingTop: t.space[2],
    paddingBottom: t.space[2],
    paddingHorizontal: t.space[3],
  },
  ring: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: t.radius.lg,
    borderWidth: RING,
    borderColor: t.colors.primary,
  },
  pressed: { opacity: t.opacity.pressed },
}));

export function ColorChipGrid({
  items,
  value,
  onValueChange,
}: ColorChipGridProps) {
  const t = useTheme();
  const s = useStyles();
  const rows: ColorChip[][] = [];
  items.forEach((item, i) => {
    if (i % COLUMNS === 0) rows.push([]);
    rows[rows.length - 1]!.push(item);
  });
  return (
    <View accessibilityRole="radiogroup" style={s.grid}>
      {rows.map((row) => (
        <View key={row[0]!.key} style={s.row}>
          {row.map((item) => {
            const selected = item.key === value;
            return (
              <PressableBase
                key={item.key}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                accessibilityLabel={`${item.name}, ${item.code}`}
                onPress={() => onValueChange(item.key)}
                pressedStyle={s.pressed}
                style={s.cell}
              >
                <View style={s.chip}>
                  <View style={[s.face, { backgroundColor: item.color }]}>
                    {selected ? (
                      <View style={s.mark}>
                        <CheckGlyph
                          color={t.colors.primaryForeground}
                          size={CHECK}
                        />
                      </View>
                    ) : null}
                  </View>
                  <View style={s.label}>
                    <Text variant="caption" weight="semibold" numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text variant="caption" tone="muted" numberOfLines={1}>
                      {item.code}
                    </Text>
                  </View>
                </View>
                {selected ? <View pointerEvents="none" style={s.ring} /> : null}
              </PressableBase>
            );
          })}
          {row.length < COLUMNS ? <View style={s.cell} /> : null}
        </View>
      ))}
    </View>
  );
}
