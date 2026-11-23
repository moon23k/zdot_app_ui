import { Fragment } from 'react';
import { FlatList, Image, View, type ViewStyle } from 'react-native';
import { Skeleton } from '../../components/skeleton/skeleton';
import { CheckGlyph, PlusGlyph, SparklesGlyph } from '../../internal/glyphs';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { withAlpha } from '../../utils/color';
import { makeStyles } from '../../utils/styles';

export type AssetGridItem = {
  key: string;
  uri: string | null;
  made?: boolean;
  pending?: boolean;
};

export type AssetGridProps = {
  items: readonly AssetGridItem[];
  value?: string | null;
  onValueChange?: (key: string | null) => void;
  onLongPress?: (key: string) => void;
  onAdd?: () => void;
  addLabel?: string;
  onEndReached?: () => void;
  loadingMore?: boolean;
  variant?: 'grid' | 'row';
};

const COLUMNS = 3;
const PICK = 3;
const MADE = 0.45;
const ROW_RATIO = 3 / 4;

type Cell =
  | { kind: 'add'; key: string }
  | { kind: 'blank'; key: string }
  | { kind: 'item'; key: string; item: AssetGridItem };

const useStyles = makeStyles((t) => ({
  root: { flex: 1 },
  list: { gap: t.space[1] },
  line: { gap: t.space[1] },
  cell: {
    flex: 1,
    aspectRatio: 1,
    overflow: 'hidden',
    borderRadius: t.radius.md,
    backgroundColor: t.colors.muted,
  },
  blank: { flex: 1, aspectRatio: 1 },
  add: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.background,
  },
  photo: { width: '100%', height: '100%' },
  pick: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderWidth: PICK,
    borderColor: t.colors.primary,
    borderRadius: t.radius.md,
  },
  check: {
    position: 'absolute',
    top: t.space[2],
    right: t.space[2],
    width: t.space[6],
    height: t.space[6],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: t.radius.full,
    borderWidth: 2,
    borderColor: t.colors.surface,
    backgroundColor: t.colors.primary,
  },
  made: {
    position: 'absolute',
    left: t.space[2],
    bottom: t.space[2],
    width: t.space[6],
    height: t.space[6],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: t.radius.full,
    backgroundColor: withAlpha(t.colors.title, MADE),
  },
  more: { flexDirection: 'row', gap: t.space[1] },
  row: {
    flexDirection: 'row',
    gap: t.space[2],
    paddingHorizontal: t.space[4],
    paddingTop: t.space[1],
  },
  slot: { flex: 1, aspectRatio: ROW_RATIO },
}));

export function AssetGrid({
  items,
  value,
  onValueChange,
  onLongPress,
  onAdd,
  addLabel = '사진 올리기',
  onEndReached,
  loadingMore,
  variant = 'grid',
}: AssetGridProps) {
  const t = useTheme();
  const s = useStyles();
  const picking = !!onValueChange;

  const cells: Cell[] = [
    ...(onAdd ? [{ kind: 'add', key: '__add' } as const] : []),
    ...items.map((item) => ({ kind: 'item' as const, key: item.key, item })),
  ];
  for (let i = 0; cells.length % COLUMNS; i += 1) {
    cells.push({ kind: 'blank', key: `__blank${i}` });
  }

  const render = (cell: Cell, slot?: ViewStyle) => {
    if (cell.kind === 'blank') return <View style={s.blank} />;
    if (cell.kind === 'add') {
      return (
        <PressableBase
          onPress={onAdd}
          feedback="small"
          accessibilityLabel={addLabel}
          style={[s.cell, s.add]}
        >
          <PlusGlyph color={t.colors.mutedForeground} size={t.iconSize.md} />
        </PressableBase>
      );
    }
    const { item } = cell;
    if (item.pending) {
      return (
        <View style={[s.cell, slot]}>
          <Skeleton width="100%" height="100%" radius={t.radius.md} />
        </View>
      );
    }
    const selected = picking && value === item.key;
    const face = (
      <>
        {item.uri ? (
          <Image
            source={{ uri: item.uri }}
            resizeMode="cover"
            style={s.photo}
          />
        ) : null}
        {item.made ? (
          <View pointerEvents="none" style={s.made}>
            <SparklesGlyph
              color={t.colors.primaryForeground}
              size={t.iconSize.sm}
            />
          </View>
        ) : null}
        {selected ? (
          <>
            <View pointerEvents="none" style={s.pick} />
            <View pointerEvents="none" style={s.check}>
              <CheckGlyph
                color={t.colors.primaryForeground}
                size={t.iconSize.sm}
              />
            </View>
          </>
        ) : null}
      </>
    );
    if (!picking && !onLongPress) {
      return <View style={[s.cell, slot]}>{face}</View>;
    }
    return (
      <PressableBase
        onPress={
          picking ? () => onValueChange(selected ? null : item.key) : undefined
        }
        onLongPress={onLongPress ? () => onLongPress(item.key) : undefined}
        feedback="small"
        accessibilityLabel={item.made ? '만든 이미지' : '사진'}
        accessibilityRole={picking ? 'radio' : 'button'}
        accessibilityState={picking ? { checked: selected } : undefined}
        style={[s.cell, slot]}
      >
        {face}
      </PressableBase>
    );
  };

  if (variant === 'row') {
    return (
      <View
        accessibilityRole={picking ? 'radiogroup' : undefined}
        style={s.row}
      >
        {items.map((item) => (
          <Fragment key={item.key}>
            {render({ kind: 'item', key: item.key, item }, s.slot)}
          </Fragment>
        ))}
      </View>
    );
  }

  const footer = loadingMore ? (
    <View style={s.more}>
      {Array.from({ length: COLUMNS }, (_, i) => (
        <View key={i} style={s.cell}>
          <Skeleton width="100%" height="100%" radius={t.radius.md} />
        </View>
      ))}
    </View>
  ) : undefined;

  return (
    <FlatList
      data={cells}
      keyExtractor={(cell) => cell.key}
      numColumns={COLUMNS}
      renderItem={({ item }) => render(item)}
      accessibilityRole={picking ? 'radiogroup' : undefined}
      style={s.root}
      contentContainerStyle={s.list}
      columnWrapperStyle={s.line}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={footer}
    />
  );
}
