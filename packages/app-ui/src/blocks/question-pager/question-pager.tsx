import { useEffect, useRef, useState, type ComponentRef } from 'react';
import {
  ScrollView,
  Text as RNText,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Text } from '../../components/text/text';
import { CheckDisc } from '../../internal/check-disc';
import { CheckGlyph } from '../../internal/glyphs';
import { haptic } from '../../internal/haptics';
import { PressableBase } from '../../internal/pressable-base';
import { useReducedMotion } from '../../internal/use-reduced-motion';
import { useTheme } from '../../theme/theme-provider';
import { withAlpha } from '../../utils/color';
import { gradientStyle, makeStyles } from '../../utils/styles';

export type QuestionPagerOption = { value: string; label: string };

export type QuestionPagerQuestion = {
  key: string;
  label: string;
  options: readonly QuestionPagerOption[];
};

export type QuestionPagerGroup = {
  key: string;
  label: string;
  questions: readonly QuestionPagerQuestion[];
};

export type QuestionPagerProps = {
  groups: readonly QuestionPagerGroup[];
  value: Readonly<Record<string, string | undefined>>;
  onValueChange: (questionKey: string, optionValue: string) => void;
  activeGroup: string;
  onActiveGroupChange: (groupKey: string) => void;
  style?: StyleProp<ViewStyle>;
};

const COLUMNS = 2;
const LINE = 2;
const MARK = 18;
const HAIR = 0.5;
const HAIR_ALPHA = 0.6;
const HOLD = 280;
const SETTLE = 1000;
const NEAR = 1;
const REACH = 3;

type Frame = { y: number; h: number };

const useStyles = makeStyles((t) => ({
  root: { flex: 1 },
  tabs: {
    flexDirection: 'row',
    gap: t.space[6],
    marginHorizontal: -t.layout.screenX,
    paddingHorizontal: t.layout.screenX,
  },
  hair: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: HAIR,
    opacity: HAIR_ALPHA,
    backgroundColor: t.colors.input,
  },
  tab: {
    height: t.controlSize.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[1],
  },
  tabLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: LINE,
    backgroundColor: t.colors.primary,
  },
  tabText: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.label.fontSize,
    letterSpacing: t.typography.label.letterSpacing,
    lineHeight: t.typography.label.lineHeight,
    fontWeight: '500',
    color: t.colors.faint,
  },
  tabActiveText: { fontWeight: '600', color: t.colors.title },
  tabDoneText: { color: t.colors.mutedForeground },
  area: { flex: 1, marginHorizontal: -t.layout.screenX },
  flow: {
    gap: t.space[12],
    paddingTop: t.space[5],
    paddingHorizontal: t.layout.screenX,
  },
  group: { gap: t.space[6] + t.space[1] },
  question: { gap: t.space[3] },
  grid: { gap: t.space[2] },
  row: { flexDirection: 'row', gap: t.space[2] },
  cell: { flex: 1, minWidth: 0 },
  tile: {
    flex: 1,
    minWidth: 0,
    height: t.controlSize.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[2],
    paddingHorizontal: t.space[3],
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.recess,
  },
  tilePicked: {
    backgroundColor: t.colors.raised,
    boxShadow: t.shadow.liftSm,
  },
  tileText: { flex: 1, color: t.colors.mutedForeground },
  tilePickedText: { flex: 1, color: t.colors.title },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: t.space[8],
  },
}));

function answered(
  group: QuestionPagerGroup,
  value: QuestionPagerProps['value']
) {
  return group.questions.every((q) => Boolean(value[q.key]));
}

function rows<T>(items: readonly T[]) {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += COLUMNS) {
    out.push(items.slice(i, i + COLUMNS));
  }
  return out;
}

export function QuestionPager({
  groups,
  value,
  onValueChange,
  activeGroup,
  onActiveGroupChange,
  style,
}: QuestionPagerProps) {
  const t = useTheme();
  const s = useStyles();
  const reduced = useReducedMotion();
  const top = t.space[5];
  const indexOf = (key: string) =>
    Math.max(
      0,
      groups.findIndex((g) => g.key === key)
    );
  const [current, setCurrent] = useState(() => indexOf(activeGroup));
  const [frames, setFrames] = useState<readonly (Frame | undefined)[]>([]);
  const [viewport, setViewport] = useState(0);
  const scroller = useRef<ComponentRef<typeof ScrollView>>(null);
  const live = useRef({ current, frames, groups, onActiveGroupChange });
  live.current = { current, frames, groups, onActiveGroupChange };
  const offset = useRef(0);
  const lock = useRef<number | null>(null);
  const hold = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touched = useRef(false);
  const aligned = useRef(false);
  const last = frames[groups.length - 1];
  const measured = viewport > 0 && groups.every((_, i) => frames[i]);
  const tail = Math.max(t.space[6], viewport - top - (last?.h ?? 0));

  const show = (i: number) => {
    const now = live.current;
    const g = now.groups[i];
    if (!g || i === now.current) return;
    now.current = i;
    setCurrent(i);
    now.onActiveGroupChange(g.key);
  };

  const release = () => {
    lock.current = null;
    if (settle.current) clearTimeout(settle.current);
    settle.current = null;
  };

  const cancel = () => {
    if (hold.current) clearTimeout(hold.current);
    hold.current = null;
  };

  const go = (i: number, animated: boolean) => {
    show(i);
    const f = live.current.frames[i];
    if (!f) return;
    const y = Math.max(0, f.y - top);
    release();
    if (animated && Math.abs(offset.current - y) > NEAR) {
      lock.current = y;
      settle.current = setTimeout(release, SETTLE);
    }
    scroller.current?.scrollTo({ y, animated });
  };

  const goRef = useRef(go);
  goRef.current = go;

  useEffect(
    () => () => {
      if (hold.current) clearTimeout(hold.current);
      if (settle.current) clearTimeout(settle.current);
    },
    []
  );

  useEffect(() => {
    if (aligned.current || !measured) return;
    aligned.current = true;
    goRef.current(indexOf(activeGroup), false);
  });

  useEffect(() => {
    if (!aligned.current) return;
    const i = groups.findIndex((g) => g.key === activeGroup);
    if (i < 0 || i === live.current.current) return;
    goRef.current(i, touched.current && !reduced);
  }, [activeGroup, groups, reduced]);

  const touch = () => {
    touched.current = true;
    cancel();
    release();
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const y = contentOffset.y;
    offset.current = y;
    if (hold.current) cancel();
    if (lock.current !== null) {
      if (Math.abs(y - lock.current) > NEAR) return;
      release();
    }
    const view = layoutMeasurement.height;
    const end = contentSize.height - view - NEAR;
    const fs = live.current.frames;
    let i = 0;
    if (y >= end) {
      i = groups.length - 1;
    } else {
      fs.forEach((f, k) => {
        if (f && f.y - top <= y + view / REACH) i = k;
      });
    }
    show(i);
  };

  const measure = (i: number) => (e: LayoutChangeEvent) => {
    const { y, height } = e.nativeEvent.layout;
    setFrames((prev) => {
      const f = prev[i];
      if (f && f.y === y && f.h === height) return prev;
      const next = [...prev];
      next[i] = { y, h: height };
      return next;
    });
  };

  const pick = (gi: number, questionKey: string, optionValue: string) => {
    const group = groups[gi];
    if (!group || value[questionKey] === optionValue) return;
    const wasDone = answered(group, value);
    haptic('select');
    onValueChange(questionKey, optionValue);
    if (
      wasDone ||
      gi + 1 >= groups.length ||
      !answered(group, { ...value, [questionKey]: optionValue })
    ) {
      return;
    }
    cancel();
    if (reduced) {
      go(gi + 1, false);
      return;
    }
    hold.current = setTimeout(() => {
      hold.current = null;
      goRef.current(gi + 1, true);
    }, HOLD);
  };

  const bg = t.colors.background;

  return (
    <View style={[s.root, style]}>
      <View accessibilityRole="tablist" style={s.tabs}>
        <View pointerEvents="none" style={s.hair} />
        {groups.map((g, i) => {
          const selected = i === current;
          const done = !selected && answered(g, value);
          return (
            <PressableBase
              key={g.key}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={g.label}
              feedback="row"
              onPress={() => {
                touched.current = true;
                cancel();
                if (!selected) haptic('select');
                go(i, !reduced);
              }}
              style={s.tab}
            >
              <RNText
                numberOfLines={1}
                maxFontSizeMultiplier={t.maxFontScale}
                style={[
                  s.tabText,
                  selected && s.tabActiveText,
                  done && s.tabDoneText,
                ]}
              >
                {g.label}
              </RNText>
              {done ? (
                <CheckGlyph color={t.colors.primary} size={t.iconSize.sm} />
              ) : null}
              {selected ? (
                <View pointerEvents="none" style={s.tabLine} />
              ) : null}
            </PressableBase>
          );
        })}
      </View>
      <View style={s.area}>
        <ScrollView
          ref={scroller}
          onLayout={(e) => setViewport(e.nativeEvent.layout.height)}
          onScroll={onScroll}
          scrollEventThrottle={16}
          onTouchStart={touch}
          onScrollBeginDrag={touch}
          contentContainerStyle={[s.flow, { paddingBottom: tail }]}
        >
          {groups.map((group, gi) => (
            <View key={group.key} onLayout={measure(gi)} style={s.group}>
              {group.questions.map((q) => (
                <View
                  key={q.key}
                  accessibilityRole="radiogroup"
                  accessibilityLabel={q.label}
                  style={s.question}
                >
                  <Text weight="semibold">{q.label}</Text>
                  <View style={s.grid}>
                    {rows(q.options).map((row) => (
                      <View key={row[0]!.value} style={s.row}>
                        {row.map((option) => {
                          const picked = value[q.key] === option.value;
                          return (
                            <PressableBase
                              key={option.value}
                              accessibilityRole="radio"
                              accessibilityState={{ checked: picked }}
                              accessibilityLabel={option.label}
                              feedback="small"
                              onPress={() => pick(gi, q.key, option.value)}
                              style={[s.tile, picked && s.tilePicked]}
                            >
                              <Text
                                weight={picked ? 'semibold' : 'medium'}
                                numberOfLines={1}
                                style={picked ? s.tilePickedText : s.tileText}
                              >
                                {option.label}
                              </Text>
                              {picked ? <CheckDisc size={MARK} /> : null}
                            </PressableBase>
                          );
                        })}
                        {row.length < COLUMNS ? <View style={s.cell} /> : null}
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
        <View
          pointerEvents="none"
          style={[
            s.fade,
            gradientStyle(
              `linear-gradient(180deg, ${withAlpha(bg, 0)}, ${bg})`
            ),
          ]}
        />
      </View>
    </View>
  );
}
