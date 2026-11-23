import { ScrollView, View } from 'react-native';
import { Text } from '../../components/text/text';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';
import { DETAIL_LAYOUTS, type DetailLayout } from './detail-types';

export type LayoutPickerProps = {
  value: DetailLayout | null;
  onValueChange: (layout: DetailLayout) => void;
  labels?: Partial<Record<DetailLayout, string>>;
  items?: readonly DetailLayout[];
};

const LABELS: Record<DetailLayout, string> = {
  image_top: '사진 위 · 글 아래',
  text_top: '글 위 · 사진 아래',
  side: '나란히',
  image: '꽉 찬 사진',
  two_images: '사진 두 장',
  card: '카드',
  text: '글만',
  table: '표',
  steps: '순서',
};

const DIAGRAM_ROWS = [0, 1, 2];

const useStyles = makeStyles((t) => ({
  row: { gap: t.space[2], paddingHorizontal: t.space[3] },
  item: { width: t.space[16] + t.space[6], gap: t.space[1] },
  frame: {
    height: t.space[12] * 2,
    overflow: 'hidden',
    borderRadius: t.radius.md,
    backgroundColor: t.colors.background,
    padding: t.space[1],
    gap: t.space[1],
  },
  on: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: t.radius.md,
    borderWidth: 2,
    borderColor: t.colors.primary,
  },
  onLabel: { color: t.colors.selectForeground },
  photo: {
    flex: 1,
    borderRadius: t.radius.sm,
    backgroundColor: t.colors.input,
  },
  lines: { gap: t.space[1], padding: t.space[1] },
  line: { height: t.space[1], borderRadius: t.radius.full },
  split: { flex: 1, flexDirection: 'row', gap: t.space[1] },
  half: { flex: 1, justifyContent: 'center' },
  long: { width: '80%' },
  short: { width: '50%' },
  list: { flex: 1, justifyContent: 'center', padding: t.space[1] },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[1],
    paddingVertical: t.space[1],
    borderTopWidth: 1,
    borderColor: t.colors.border,
  },
  tableLast: { borderBottomWidth: 1 },
  cellShort: { width: '30%' },
  cellLong: { width: '55%' },
  steps: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[1],
  },
  step: { flex: 1, alignItems: 'center', gap: t.space[1] },
  dot: {
    width: t.space[3],
    height: t.space[3],
    borderRadius: t.radius.full,
    borderWidth: 1,
    borderColor: t.colors.mutedForeground,
  },
  stepLine: { width: '70%' },
  card: {
    flex: 1,
    borderRadius: t.radius.sm,
    backgroundColor: t.colors.surface,
    padding: t.space[1],
    gap: t.space[1],
  },
}));

export function Diagram({ layout }: { layout: DetailLayout }) {
  const t = useTheme();
  const s = useStyles();
  const photo = <View style={s.photo} />;
  const lines = (
    <View style={s.lines}>
      <View
        style={[s.line, s.long, { backgroundColor: t.colors.foreground }]}
      />
      <View
        style={[s.line, s.short, { backgroundColor: t.colors.mutedForeground }]}
      />
    </View>
  );
  switch (layout) {
    case 'image_top':
      return (
        <>
          {photo}
          {lines}
        </>
      );
    case 'text_top':
      return (
        <>
          {lines}
          {photo}
        </>
      );
    case 'side':
      return (
        <View style={s.split}>
          {photo}
          <View style={s.half}>{lines}</View>
        </View>
      );
    case 'two_images':
      return (
        <>
          <View style={s.split}>
            {photo}
            {photo}
          </View>
          {lines}
        </>
      );
    case 'card':
      return (
        <View style={s.card}>
          {photo}
          {lines}
        </View>
      );
    case 'text':
      return <View style={s.half}>{lines}</View>;
    case 'table':
      return (
        <View style={s.list}>
          {DIAGRAM_ROWS.map((row) => (
            <View
              key={row}
              style={[
                s.tableRow,
                row === DIAGRAM_ROWS.length - 1 && s.tableLast,
              ]}
            >
              <View
                style={[
                  s.line,
                  s.cellShort,
                  { backgroundColor: t.colors.mutedForeground },
                ]}
              />
              <View
                style={[
                  s.line,
                  s.cellLong,
                  { backgroundColor: t.colors.foreground },
                ]}
              />
            </View>
          ))}
        </View>
      );
    case 'steps':
      return (
        <View style={s.steps}>
          {DIAGRAM_ROWS.map((row) => (
            <View key={row} style={s.step}>
              <View style={s.dot} />
              <View
                style={[
                  s.line,
                  s.stepLine,
                  { backgroundColor: t.colors.foreground },
                ]}
              />
            </View>
          ))}
        </View>
      );
    default:
      return photo;
  }
}

export function LayoutPicker({
  value,
  onValueChange,
  labels,
  items = DETAIL_LAYOUTS,
}: LayoutPickerProps) {
  const s = useStyles();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.row}
      accessibilityRole="radiogroup"
    >
      {items.map((layout) => {
        const on = layout === value;
        const label = labels?.[layout] ?? LABELS[layout];
        return (
          <PressableBase
            key={layout}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
            accessibilityLabel={label}
            onPress={() => onValueChange(layout)}
            style={s.item}
          >
            <View>
              <View style={s.frame}>
                <Diagram layout={layout} />
              </View>
              {on ? <View pointerEvents="none" style={s.on} /> : null}
            </View>
            <Text
              variant="caption"
              tone="muted"
              weight={on ? 'semibold' : undefined}
              numberOfLines={1}
              style={on && s.onLabel}
            >
              {label}
            </Text>
          </PressableBase>
        );
      })}
    </ScrollView>
  );
}
