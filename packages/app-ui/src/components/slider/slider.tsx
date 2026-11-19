import { useMemo, useRef, useState } from 'react';
import {
  PanResponder,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { makeStyles } from '../../utils/styles';
import { Text } from '../text/text';

export type SliderProps = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  onSlidingStart?: () => void;
  startLabel?: string;
  endLabel?: string;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
};

const TRACK = 6;
const THUMB = 28;
const TICK_WIDTH = 2;
const TICK_HEIGHT = 16;
const NUDGE = 10;

export function sliderOrigin(min: number, max: number) {
  return min < 0 && max > 0 ? 0 : min;
}

const useStyles = makeStyles((t) => ({
  root: { flexDirection: 'row', alignItems: 'center', gap: t.space[2] },
  end: { width: t.space[12] },
  endRight: { width: t.space[12], textAlign: 'right' },
  area: { flex: 1, height: t.minTouchSize },
  track: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: (t.minTouchSize - TRACK) / 2,
    height: TRACK,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.input,
  },
  fill: {
    position: 'absolute',
    top: (t.minTouchSize - TRACK) / 2,
    height: TRACK,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.primary,
  },
  tick: {
    position: 'absolute',
    top: (t.minTouchSize - TICK_HEIGHT) / 2,
    width: TICK_WIDTH,
    height: TICK_HEIGHT,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.ring,
  },
  thumb: {
    position: 'absolute',
    top: (t.minTouchSize - THUMB) / 2,
    width: THUMB,
    height: THUMB,
    borderRadius: t.radius.full,
    backgroundColor:
      t.scheme === 'dark' ? t.colors.foreground : t.colors.surface,
    boxShadow: t.shadow.md,
  },
}));

export function Slider({
  value,
  min = 0,
  max = 1,
  onChange,
  onSlidingStart,
  startLabel,
  endLabel,
  accessibilityLabel,
  style,
}: SliderProps) {
  const s = useStyles();
  const [width, setWidth] = useState(0);
  const span = max - min;
  const latest = useRef({ value, onChange, onSlidingStart, min, span, width });
  latest.current = { value, onChange, onSlidingStart, min, span, width };
  const origin = useRef(0);
  const pick = (x: number) => {
    const {
      width: w,
      min: lo,
      span: n,
      value: now,
      onChange: change,
    } = latest.current;
    if (w <= 0 || n <= 0) return;
    const room = w - THUMB;
    const at = Math.max(0, Math.min(room, x - THUMB / 2));
    const next = lo + (at / room) * n;
    if (next !== now) change(next);
  };
  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > Math.abs(g.dy),
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (e) => {
          latest.current.onSlidingStart?.();
          origin.current = e.nativeEvent.locationX;
          pick(origin.current);
        },
        onPanResponderMove: (_, g) => pick(origin.current + g.dx),
      }),
    []
  );
  const ratio =
    span > 0 ? (Math.min(max, Math.max(min, value)) - min) / span : 0;
  const base = sliderOrigin(min, max);
  const baseRatio = span > 0 ? (base - min) / span : 0;
  const room = Math.max(0, width - THUMB);
  const left = ratio * room;
  const center = left + THUMB / 2;
  const baseCenter = base === min ? 0 : baseRatio * room + THUMB / 2;
  return (
    <View style={[s.root, style]}>
      {startLabel ? (
        <Text variant="caption" tone="muted" numberOfLines={1} style={s.end}>
          {startLabel}
        </Text>
      ) : null}
      <View
        {...pan.panHandlers}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{ min: 0, max: 100, now: Math.round(ratio * 100) }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(e) => {
          onSlidingStart?.();
          const step =
            (span / NUDGE) *
            (e.nativeEvent.actionName === 'increment' ? 1 : -1);
          onChange(Math.min(max, Math.max(min, value + step)));
        }}
        onLayout={(e: LayoutChangeEvent) =>
          setWidth(e.nativeEvent.layout.width)
        }
        style={s.area}
      >
        <View style={s.track} pointerEvents="none" />
        {width > 0 ? (
          <>
            <View
              testID="slider-fill"
              style={[
                s.fill,
                {
                  left: Math.min(baseCenter, center),
                  width: Math.abs(center - baseCenter),
                },
              ]}
              pointerEvents="none"
            />
            {base > min ? (
              <View
                testID="slider-origin"
                style={[s.tick, { left: baseCenter - TICK_WIDTH / 2 }]}
                pointerEvents="none"
              />
            ) : null}
            <View style={[s.thumb, { left }]} pointerEvents="none" />
          </>
        ) : null}
      </View>
      {endLabel ? (
        <Text
          variant="caption"
          tone="muted"
          numberOfLines={1}
          style={s.endRight}
        >
          {endLabel}
        </Text>
      ) : null}
    </View>
  );
}
