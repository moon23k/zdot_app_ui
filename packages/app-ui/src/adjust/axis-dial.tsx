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
import { useTheme } from '../theme/theme-provider';
import { makeStyles } from '../utils/styles';
import { clamp } from './hsl';

export type AxisDialProps = {
  value: number;
  onChange: (value: number) => void;
  startLabel: string;
  endLabel: string;
  centerLabel?: string;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
};

const MIN = 0;
const MAX = 100;
const ORIGIN = 50;
const SNAP = 2;
const STEP = 5;
const BOX = 300;
const MID = BOX / 2;
const SWEEP = 135;
const TICK_EVERY = 2;
const MAJOR_EVERY = 5;
const OUTER = 138;
const MAJOR_IN = 124;
const MINOR_IN = 129;
const DISK = 104;
const DOT_AT = 86;
const DOT = 14;
const END_GAP = 10;
const END_W = 104;
const DEAD = 24;
const NUMBER_SIZE = 46;
const NUMBER_LINE = 50;
const NUMBER_TRACK = -1.38;

const point = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: MID + r * Math.sin(a), y: MID - r * Math.cos(a) };
};

const angleOf = (v: number) => -SWEEP + ((v - MIN) / (MAX - MIN)) * 2 * SWEEP;

const settle = (v: number) => (Math.abs(v - ORIGIN) <= SNAP ? ORIGIN : v);

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
    gap: t.space[1],
  },
  number: { fontWeight: '500', fontVariant: ['tabular-nums'] },
  end: { position: 'absolute', alignItems: 'center' },
}));

export function AxisDial({
  value,
  onChange,
  startLabel,
  endLabel,
  centerLabel = '중간',
  accessibilityLabel,
  style,
}: AxisDialProps) {
  const t = useTheme();
  const s = useStyles();
  const [size, setSize] = useState(0);
  const [live, setLive] = useState<number | null>(null);
  const box = useRef<ComponentRef<typeof View>>(null);
  const latest = useRef({ value, onChange });
  latest.current = { value, onChange };
  const center = useRef<{ x: number; y: number } | null>(null);
  const prev = useRef<number | null>(null);
  const raw = useRef(value);
  const sent = useRef(value);
  const pan = useMemo(() => {
    const angleAt = (x: number, y: number) => {
      const c = center.current;
      if (!c) return null;
      const dx = x - c.x;
      const dy = y - c.y;
      if (Math.hypot(dx, dy) < DEAD) return null;
      return (Math.atan2(dx, -dy) * 180) / Math.PI;
    };
    const finish = () => {
      prev.current = null;
      const end = settle(Math.round(raw.current));
      if (end !== sent.current) {
        sent.current = end;
        latest.current.onChange(end);
      }
      setLive(null);
    };
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => {
        const { pageX, pageY } = e.nativeEvent;
        const start = clamp(latest.current.value, MIN, MAX);
        raw.current = start;
        sent.current = Math.round(start);
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
        raw.current = clamp(
          raw.current + (d * (MAX - MIN)) / (2 * SWEEP),
          MIN,
          MAX
        );
        setLive(raw.current);
        const next = Math.round(raw.current);
        if (next !== sent.current) {
          sent.current = next;
          latest.current.onChange(next);
        }
      },
      onPanResponderRelease: finish,
      onPanResponderTerminate: finish,
    });
  }, []);

  const shown = clamp(live ?? value, MIN, MAX);
  const now = Math.round(shown);
  const word =
    now > ORIGIN ? endLabel : now < ORIGIN ? startLabel : centerLabel;
  const ticks = [];
  for (let v = MIN; v <= MAX; v += TICK_EVERY) {
    const deg = angleOf(v);
    const major = (v / TICK_EVERY) % MAJOR_EVERY === 0;
    const lit =
      shown >= ORIGIN ? v >= ORIGIN && v <= shown : v <= ORIGIN && v >= shown;
    const a = point(major ? MAJOR_IN : MINOR_IN, deg);
    const b = point(OUTER, deg);
    ticks.push(
      <Line
        key={v}
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        stroke={
          lit ? t.colors.primary : major ? t.colors.arcMuted : t.colors.input
        }
        strokeWidth={major ? 2.5 : 1.8}
        strokeLinecap="round"
      />
    );
  }
  const k = size / BOX;
  const dot = point(DOT_AT, angleOf(shown));
  const startEnd = point(OUTER, -SWEEP);
  const endEnd = point(OUTER, SWEEP);
  const toStart = now < ORIGIN;
  const toEnd = now > ORIGIN;

  return (
    <View
      ref={box}
      {...pan.panHandlers}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: MIN, max: MAX, now, text: `${now} ${word}` }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) =>
        onChange(
          clamp(
            now + (e.nativeEvent.actionName === 'increment' ? STEP : -STEP),
            MIN,
            MAX
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
            <Text
              variant="display"
              numberOfLines={1}
              style={[
                s.number,
                {
                  fontSize: NUMBER_SIZE * k,
                  lineHeight: NUMBER_LINE * k,
                  letterSpacing: NUMBER_TRACK * k,
                },
              ]}
            >
              {now}
            </Text>
            <Text
              variant="bodyLg"
              tone="muted"
              weight="semibold"
              numberOfLines={1}
            >
              {word}
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
