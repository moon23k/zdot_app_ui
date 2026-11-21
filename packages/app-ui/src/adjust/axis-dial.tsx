import { useMemo, useRef, useState, type ComponentRef } from 'react';
import {
  PanResponder,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { Text } from '../components/text/text';
import { sliderOrigin } from '../components/slider/slider';
import { useTheme } from '../theme/theme-provider';
import { makeStyles } from '../utils/styles';
import { clamp } from './hsl';

export type AxisDialProps = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  valueLabel: string;
  startLabel: string;
  endLabel: string;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
};

const BOX = 300;
const MID = BOX / 2;
const SWEEP = 135;
const MINOR = 8;
const OUTER = 138;
const MAJOR_IN = 124;
const MINOR_IN = 128;
const DISK = 104;
const DOT_AT = 86;
const DOT = 12;
const END_GAP = 10;
const END_W = 104;
const DEAD = 24;

const point = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: MID + r * Math.sin(a), y: MID - r * Math.cos(a) };
};

const useStyles = makeStyles((t) => ({
  root: {
    width: '100%',
    maxWidth: BOX,
    aspectRatio: 1,
    alignSelf: 'center',
  },
  disk: {
    position: 'absolute',
    borderRadius: t.radius.full,
    backgroundColor: t.colors.surface,
    boxShadow: t.shadow.md,
  },
  dot: {
    position: 'absolute',
    borderRadius: t.radius.full,
    backgroundColor: t.colors.primary,
  },
  center: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  end: { position: 'absolute', alignItems: 'center' },
}));

export function AxisDial({
  value,
  min = -2,
  max = 2,
  onChange,
  valueLabel,
  startLabel,
  endLabel,
  accessibilityLabel,
  style,
}: AxisDialProps) {
  const t = useTheme();
  const s = useStyles();
  const [size, setSize] = useState(0);
  const box = useRef<ComponentRef<typeof View>>(null);
  const latest = useRef({ value, onChange, min, max });
  latest.current = { value, onChange, min, max };
  const center = useRef<{ x: number; y: number } | null>(null);
  const prev = useRef<number | null>(null);
  const raw = useRef(value);
  const pan = useMemo(() => {
    const angleAt = (x: number, y: number) => {
      const c = center.current;
      if (!c) return null;
      const dx = x - c.x;
      const dy = y - c.y;
      if (Math.hypot(dx, dy) < DEAD) return null;
      return (Math.atan2(dx, -dy) * 180) / Math.PI;
    };
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => {
        const { pageX, pageY } = e.nativeEvent;
        raw.current = latest.current.value;
        prev.current = null;
        box.current?.measure((_x, _y, w, h, px, py) => {
          center.current = { x: px + w / 2, y: py + h / 2 };
          prev.current = angleAt(pageX, pageY);
        });
      },
      onPanResponderMove: (_, g) => {
        const a = angleAt(g.moveX, g.moveY);
        if (a === null) return;
        if (prev.current === null) {
          prev.current = a;
          return;
        }
        let d = a - prev.current;
        if (d > 180) d -= 360;
        if (d < -180) d += 360;
        prev.current = a;
        const {
          min: lo,
          max: hi,
          value: now,
          onChange: change,
        } = latest.current;
        raw.current = clamp(
          raw.current + (d * (hi - lo)) / (2 * SWEEP),
          lo,
          hi
        );
        const next = Math.round(raw.current);
        if (next !== now) change(next);
      },
      onPanResponderRelease: () => {
        prev.current = null;
      },
      onPanResponderTerminate: () => {
        prev.current = null;
      },
    });
  }, []);

  const span = max - min;
  const origin = sliderOrigin(min, max);
  const now = clamp(value, min, max);
  const count = span * MINOR + 1;
  const ticks = [];
  for (let i = 0; i < count; i += 1) {
    const v = min + i / MINOR;
    const deg = -SWEEP + (i * 2 * SWEEP) / (count - 1);
    const major = i % MINOR === 0;
    const lit =
      now >= origin ? v >= origin && v <= now : v <= origin && v >= now;
    const a = point(major ? MAJOR_IN : MINOR_IN, deg);
    const b = point(OUTER, deg);
    ticks.push(
      <Line
        key={i}
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        stroke={lit ? t.colors.primary : major ? t.colors.ring : t.colors.input}
        strokeWidth={major ? 2.5 : 2}
        strokeLinecap="round"
      />
    );
  }
  const k = size / BOX;
  const dot = point(DOT_AT, -SWEEP + ((now - min) / span) * 2 * SWEEP);
  const startEnd = point(OUTER, -SWEEP);
  const endEnd = point(OUTER, SWEEP);
  const toStart = now < origin;
  const toEnd = now > origin;

  return (
    <View
      ref={box}
      {...pan.panHandlers}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min, max, now, text: valueLabel }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) =>
        onChange(
          clamp(
            now + (e.nativeEvent.actionName === 'increment' ? 1 : -1),
            min,
            max
          )
        )
      }
      onLayout={(e: LayoutChangeEvent) => setSize(e.nativeEvent.layout.width)}
      style={[s.root, style]}
    >
      {size > 0 ? (
        <>
          <Svg
            width={size}
            height={size}
            viewBox={`0 0 ${BOX} ${BOX}`}
            pointerEvents="none"
          >
            {ticks}
          </Svg>
          <View
            pointerEvents="none"
            style={[
              s.disk,
              {
                left: (MID - DISK) * k,
                top: (MID - DISK) * k,
                width: DISK * 2 * k,
                height: DISK * 2 * k,
              },
            ]}
          />
          <View
            testID="axis-dial-dot"
            pointerEvents="none"
            style={[
              s.dot,
              {
                left: dot.x * k - DOT / 2,
                top: dot.y * k - DOT / 2,
                width: DOT,
                height: DOT,
              },
            ]}
          />
          <View pointerEvents="none" style={s.center}>
            <Text variant="title" numberOfLines={1}>
              {valueLabel}
            </Text>
          </View>
          <View
            pointerEvents="none"
            style={[
              s.end,
              {
                left: (startEnd.x - END_W / 2) * k,
                top: (startEnd.y + END_GAP) * k,
                width: END_W * k,
              },
            ]}
          >
            <Text
              variant="label"
              tone={toStart ? 'default' : 'muted'}
              weight={toStart ? 'semibold' : undefined}
              numberOfLines={1}
            >
              {startLabel}
            </Text>
          </View>
          <View
            pointerEvents="none"
            style={[
              s.end,
              {
                left: (endEnd.x - END_W / 2) * k,
                top: (endEnd.y + END_GAP) * k,
                width: END_W * k,
              },
            ]}
          >
            <Text
              variant="label"
              tone={toEnd ? 'default' : 'muted'}
              weight={toEnd ? 'semibold' : undefined}
              numberOfLines={1}
            >
              {endLabel}
            </Text>
          </View>
        </>
      ) : null}
    </View>
  );
}
