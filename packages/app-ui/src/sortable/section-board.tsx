import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentRef,
  type ReactNode,
} from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import Sortable from 'react-native-sortables';
import { SECTION_THUMB } from '../blocks/detail-studio/section-thumb';
import { Skeleton } from '../components/skeleton/skeleton';
import { Text } from '../components/text/text';
import type { SectionAnchor } from '../components/dropdown-menu/dropdown-menu';
import { EyeOffGlyph, GripGlyph, MoreGlyph } from '../internal/glyphs';
import { PressableBase } from '../internal/pressable-base';
import { useTheme } from '../theme/theme-provider';
import type { Theme } from '../types';
import { makeStyles } from '../utils/styles';
import { moveItem } from './move';

export type SectionBoardItem = {
  key: string;
  title: string;
  snippet?: string;
  thumb: ReactNode;
  hidden?: boolean;
  pending?: boolean;
};

export type SectionBoardProps = {
  items: readonly SectionBoardItem[];
  onPress: (key: string) => void;
  onMore: (key: string, anchor: SectionAnchor) => void;
  onReorder: (keys: string[]) => void;
  activeKey?: string | null;
  revealKey?: string | null;
  bottomSpace?: number;
  hiddenLabel?: string;
  moreLabel?: string;
  moveLabels?: [string, string];
};

const MOVE_LABELS: [string, string] = ['위로 이동', '아래로 이동'];
const WAIT_LINE = 120;

const rowHeight = (t: Theme) => SECTION_THUMB.height + t.space[2] * 2;

const useStyles = makeStyles((t) => ({
  scroll: { flex: 1 },
  card: {
    marginHorizontal: t.space[4],
    borderRadius: t.radius.md * 2,
    backgroundColor: t.colors.surface,
  },
  row: {
    height: rowHeight(t),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: t.space[1],
    backgroundColor: t.colors.surface,
  },
  first: {
    borderTopLeftRadius: t.radius.md * 2,
    borderTopRightRadius: t.radius.md * 2,
  },
  last: {
    borderBottomLeftRadius: t.radius.md * 2,
    borderBottomRightRadius: t.radius.md * 2,
  },
  pressed: { backgroundColor: t.colors.background },
  lifted: { borderRadius: t.radius.md * 2, boxShadow: t.shadow.lift },
  line: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: t.space[1] + t.space[8] + SECTION_THUMB.width + t.space[3],
    height: 1,
    backgroundColor: t.colors.border,
  },
  grip: {
    width: t.space[8],
    height: t.minTouchSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumb: {
    width: SECTION_THUMB.width,
    height: SECTION_THUMB.height,
    overflow: 'hidden',
    borderRadius: t.radius.md,
    backgroundColor: t.colors.surface,
  },
  ring: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: t.radius.md,
    borderWidth: 1,
    borderColor: t.colors.border,
  },
  text: { flex: 1, paddingLeft: t.space[3], paddingRight: t.space[1] },
  snippet: {
    marginTop: t.space[1],
    fontSize: t.typography.eyebrow.fontSize,
    lineHeight: t.typography.eyebrow.lineHeight,
  },
  faded: { opacity: t.opacity.disabled },
  icon: {
    width: t.minTouchSize,
    height: t.minTouchSize,
    borderRadius: t.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wait: { marginTop: t.space[2] },
  flag: { marginRight: -t.space[2] },
  turn: { transform: [{ rotate: '90deg' }] },
}));

type RowProps = {
  item: SectionBoardItem;
  index: number;
  count: number;
  active: boolean;
  lifted: boolean;
  onPress: (key: string) => void;
  onMore: (key: string, anchor: SectionAnchor) => void;
  onMove: (from: number, to: number) => void;
  hiddenLabel: string;
  moreLabel: string;
  moveLabels: [string, string];
};

const Row = memo(function SectionRow({
  item,
  index,
  count,
  active,
  lifted,
  onPress,
  onMore,
  onMove,
  hiddenLabel,
  moreLabel,
  moveLabels,
}: RowProps) {
  const t = useTheme();
  const s = useStyles();
  const more = useRef<ComponentRef<typeof View>>(null);
  const hidden = !!item.hidden;
  if (item.pending) {
    return (
      <View
        style={[s.row, index === 0 && s.first, index === count - 1 && s.last]}
      >
        {index > 0 ? <View pointerEvents="none" style={s.line} /> : null}
        <Sortable.Handle mode="fixed-order">
          <View style={s.grip} />
        </Sortable.Handle>
        <View style={s.main} accessible accessibilityLabel={item.title}>
          <View style={s.thumb}>
            <Skeleton
              width={SECTION_THUMB.width}
              height={SECTION_THUMB.height}
              radius={t.radius.md}
            />
            <View pointerEvents="none" style={s.ring} />
          </View>
          <View style={s.text}>
            <Text weight="semibold" tone="muted" numberOfLines={1}>
              {item.title}
            </Text>
            <Skeleton
              width={WAIT_LINE}
              height={t.space[3]}
              radius={t.radius.full}
              style={s.wait}
            />
          </View>
        </View>
        <View style={s.icon} />
      </View>
    );
  }
  const openMore = () => {
    const box = more.current;
    if (!box) return;
    box.measureInWindow((x, y, width, height) =>
      onMore(item.key, { x, y, width, height })
    );
  };
  return (
    <View
      style={[
        s.row,
        index === 0 && s.first,
        index === count - 1 && s.last,
        active && s.pressed,
        lifted && s.lifted,
      ]}
    >
      {index > 0 && !lifted ? (
        <View pointerEvents="none" style={s.line} />
      ) : null}
      <Sortable.Handle>
        <View
          style={s.grip}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <GripGlyph
            color={lifted ? t.colors.title : t.colors.faint}
            size={t.iconSize.md}
          />
        </View>
      </Sortable.Handle>
      <PressableBase
        onPress={() => onPress(item.key)}
        accessibilityLabel={item.title}
        accessibilityActions={[
          { name: 'decrement', label: moveLabels[0] },
          { name: 'increment', label: moveLabels[1] },
        ]}
        onAccessibilityAction={(e) =>
          onMove(
            index,
            e.nativeEvent.actionName === 'decrement' ? index - 1 : index + 1
          )
        }
        feedback="none"
        style={s.main}
      >
        <View style={[s.thumb, hidden && s.faded]}>
          {item.thumb}
          <View pointerEvents="none" style={s.ring} />
        </View>
        <View style={s.text}>
          <Text weight="semibold" numberOfLines={1} style={hidden && s.faded}>
            {item.title}
          </Text>
          {item.snippet ? (
            <Text
              tone="muted"
              numberOfLines={1}
              style={[s.snippet, hidden && s.faded]}
            >
              {item.snippet}
            </Text>
          ) : null}
        </View>
      </PressableBase>
      {hidden ? (
        <View
          accessible
          accessibilityLabel={hiddenLabel}
          style={[s.icon, s.flag]}
        >
          <EyeOffGlyph color={t.colors.mutedForeground} size={t.iconSize.md} />
        </View>
      ) : null}
      <View ref={more} collapsable={false}>
        <PressableBase
          onPress={openMore}
          accessibilityLabel={moreLabel}
          feedback="small"
          style={s.icon}
        >
          <View style={s.turn}>
            <MoreGlyph color={t.colors.mutedForeground} size={t.iconSize.md} />
          </View>
        </PressableBase>
      </View>
    </View>
  );
});

export function SectionBoard({
  items,
  onPress,
  onMore,
  onReorder,
  activeKey = null,
  revealKey = null,
  bottomSpace = 0,
  hiddenLabel = '숨김',
  moreLabel = '더보기',
  moveLabels = MOVE_LABELS,
}: SectionBoardProps) {
  const t = useTheme();
  const s = useStyles();
  const scroller = useAnimatedRef<Animated.ScrollView>();
  const [lifted, setLifted] = useState<string | null>(null);
  const live = useRef({ items, onPress, onMore, onReorder, bottomSpace });
  live.current = { items, onPress, onMore, onReorder, bottomSpace };
  const offset = useRef(0);
  const viewport = useRef(0);
  const content = useRef(0);
  const pending = useRef<string | null>(null);
  const row = rowHeight(t);

  const press = useCallback((key: string) => live.current.onPress(key), []);
  const openMore = useCallback(
    (key: string, anchor: SectionAnchor) => live.current.onMore(key, anchor),
    []
  );
  const move = useCallback((from: number, to: number) => {
    const list = live.current.items;
    if (to < 0 || to >= list.length) return;
    live.current.onReorder(moveItem(list, from, to).map((i) => i.key));
  }, []);

  const reveal = useCallback(() => {
    const key = pending.current;
    if (!key || viewport.current <= 0) return;
    const { items: list, bottomSpace: under } = live.current;
    const index = list.findIndex((i) => i.key === key);
    if (index < 0) return;
    const top = index * row;
    const bottom = top + row;
    if (content.current < bottom + under) return;
    pending.current = null;
    const visible = viewport.current - under;
    const now = offset.current;
    const next =
      top < now ? top : bottom > now + visible ? bottom - visible : now;
    if (next !== now) {
      scroller.current?.scrollTo({ y: Math.max(0, next), animated: true });
    }
  }, [row, scroller]);

  useEffect(() => {
    pending.current = revealKey;
    reveal();
  }, [revealKey, reveal]);

  return (
    <Animated.ScrollView
      ref={scroller}
      style={s.scroll}
      contentContainerStyle={{ paddingBottom: bottomSpace }}
      scrollEventThrottle={16}
      onScroll={(e) => {
        offset.current = e.nativeEvent.contentOffset.y;
      }}
      onLayout={(e) => {
        viewport.current = e.nativeEvent.layout.height;
        reveal();
      }}
      onContentSizeChange={(_w, h) => {
        content.current = h;
        reveal();
      }}
    >
      {items.length ? (
        <View style={s.card}>
          <Sortable.Grid
            data={[...items]}
            keyExtractor={(item) => item.key}
            columns={1}
            rowGap={0}
            customHandle
            scrollableRef={scroller}
            autoScrollEnabled
            activeItemScale={1.02}
            activeItemShadowOpacity={0}
            inactiveItemOpacity={1}
            onDragStart={({ key }) => setLifted(key)}
            onDragEnd={({ fromIndex, toIndex, indexToKey }) => {
              setLifted(null);
              if (fromIndex !== toIndex)
                live.current.onReorder([...indexToKey]);
            }}
            renderItem={({ item, index }) => (
              <Row
                item={item}
                index={index}
                count={items.length}
                active={item.key === activeKey}
                lifted={item.key === lifted}
                onPress={press}
                onMore={openMore}
                onMove={move}
                hiddenLabel={hiddenLabel}
                moreLabel={moreLabel}
                moveLabels={moveLabels}
              />
            )}
          />
        </View>
      ) : null}
    </Animated.ScrollView>
  );
}
