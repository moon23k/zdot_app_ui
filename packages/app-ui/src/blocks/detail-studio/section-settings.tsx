import { View } from 'react-native';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';
import {
  ColorSwatchPicker,
  type ColorSwatch,
} from '../color-swatch-picker/color-swatch-picker';
import {
  DETAIL_COLORS,
  type DetailLayout,
} from '../detail-editor/detail-types';
import {
  LABELS as LAYOUT_LABELS,
  SoftDiagram,
} from '../detail-editor/layout-picker';

export type SectionSpace = { top: number; bottom: number };

export type SectionSettingsProps = {
  layout: DetailLayout | null;
  layouts: readonly DetailLayout[];
  onLayoutChange: (layout: DetailLayout) => void;
  background: string;
  onBackgroundChange: (color: string) => void;
  space: SectionSpace;
  onSpaceChange: (space: SectionSpace) => void;
  colors?: readonly ColorSwatch[];
};

export const SECTION_SPACES: readonly { value: number; label: string }[] = [
  { value: 1, label: '좁게' },
  { value: 3, label: '보통' },
  { value: 6, label: '넓게' },
];

const COLUMNS = 4;

const useStyles = makeStyles((t) => ({
  root: { gap: t.space[4], paddingTop: t.space[1] },
  grid: { gap: t.space[2], paddingHorizontal: t.space[4] },
  row: { flexDirection: 'row', gap: t.space[2] },
  cell: { flex: 1 },
  tile: {
    height: t.space[16] + t.space[4],
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space[1],
    padding: t.space[2],
    borderRadius: t.radius.lg,
    borderWidth: 1,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
  },
  on: {
    borderColor: t.colors.primary,
    backgroundColor: t.colors.primaryTint,
  },
  inset: { paddingHorizontal: t.space[4] },
  swatches: { paddingHorizontal: t.space[1] },
  spaces: {
    flexDirection: 'row',
    gap: t.space[2],
    paddingHorizontal: t.space[4],
  },
  space: {
    flex: 1,
    height: t.controlSize.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: t.radius.lg,
    borderWidth: 1,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
  },
  gap: {
    width: '46%',
    borderTopWidth: t.space[1] / 2,
    borderBottomWidth: t.space[1] / 2,
    borderColor: t.colors.input,
  },
  gapOn: { borderColor: t.colors.primary },
}));

function rows<T>(items: readonly T[]): (T | null)[][] {
  const out: (T | null)[][] = [];
  for (let i = 0; i < items.length; i += COLUMNS) {
    const row: (T | null)[] = items.slice(i, i + COLUMNS);
    while (row.length < COLUMNS) row.push(null);
    out.push(row);
  }
  return out;
}

export function SectionSettings({
  layout,
  layouts,
  onLayoutChange,
  background,
  onBackgroundChange,
  space,
  onSpaceChange,
  colors,
}: SectionSettingsProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View style={s.root}>
      <View accessibilityRole="radiogroup" style={s.grid}>
        {rows(layouts).map((row, r) => (
          <View key={r} style={s.row}>
            {row.map((item, c) =>
              item ? (
                <PressableBase
                  key={item}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: item === layout }}
                  accessibilityLabel={LAYOUT_LABELS[item]}
                  onPress={() => onLayoutChange(item)}
                  style={s.cell}
                >
                  <View style={[s.tile, item === layout && s.on]}>
                    <SoftDiagram layout={item} />
                  </View>
                </PressableBase>
              ) : (
                <View key={`empty-${c}`} style={s.cell} />
              )
            )}
          </View>
        ))}
      </View>
      <View style={s.inset}>
        <ColorSwatchPicker
          variant="row"
          style={s.swatches}
          colors={colors ?? DETAIL_COLORS}
          value={background}
          onValueChange={onBackgroundChange}
        />
      </View>
      <View accessibilityRole="radiogroup" style={s.spaces}>
        {SECTION_SPACES.map((item) => {
          const on = space.top === item.value && space.bottom === item.value;
          return (
            <PressableBase
              key={item.value}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`여백 ${item.label}`}
              onPress={() =>
                onSpaceChange({ top: item.value, bottom: item.value })
              }
              style={[s.space, on && s.on]}
            >
              <View
                style={[
                  s.gap,
                  { height: item.value * t.space[1] + t.space[1] },
                  on && s.gapOn,
                ]}
              />
            </PressableBase>
          );
        })}
      </View>
    </View>
  );
}
