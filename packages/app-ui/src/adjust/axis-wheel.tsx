import { useEffect, useMemo, useRef, useState } from 'react';
import {
  PanResponder,
  Platform,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { Text } from '../components/text/text';
import { PressableBase } from '../internal/pressable-base';
import { useReducedMotion } from '../internal/use-reduced-motion';
import { useTheme } from '../theme/theme-provider';
import { makeStyles } from '../utils/styles';
import { clamp } from './hsl';

export type AxisLevel = -1 | 0 | 1;

export type AxisWheelProps = {
  level: AxisLevel;
  onChange: (level: AxisLevel) => void;
  startLabel: string;
  endLabel: string;
  centerLabel?: string;
  nudge?: boolean;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
};

export const AXIS_WHEEL_HEIGHT = 112;

const HEIGHT = 96;
const TOP = AXIS_WHEEL_HEIGHT - HEIGHT;
const STOP = 40;
const UNIT = 4;
const GAP = 13;
const BEND = 0.72;
const SIDE = 52;
const TICK = 2.2;
const STOP_TICK = 3;
const NEEDLE = 3;
const EDGE = 0.34;
const REST = 0.94;
const SHORT = 0.84;
const DIM = 0.72;
const OUT = 0.36;
const TAP = 5;
const TWICE = 320;
const EASE = 280;
const FLING = 90;
const NUDGE_AT = 600;
const NUDGE_FOR = 1300;
const NUDGE_BY = 6;

const rad = (deg: number) => (deg * Math.PI) / 180;

const levelAt = (position: number): AxisLevel => {
  const step = clamp(Math.round(position / STOP), -1, 1);
  return step < 0 ? -1 : step > 0 ? 1 : 0;
};

const useStyles = makeStyles((t) => ({
  root: { height: AXIS_WHEEL_HEIGHT },
  stage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: TOP,
    height: HEIGHT,
    overflow: 'hidden',
  },
  ends: {
    position: 'absolute',
    left: t.layout.screenX - t.space[2],
    right: t.layout.screenX - t.space[2],
    top: -t.space[3],
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  end: {
    height: t.controlSize.sm,
    paddingHorizontal: t.space[2],
    justifyContent: 'center',
  },
}));

const noScroll = (
  Platform.OS === 'web' ? { touchAction: 'none', cursor: 'grab' } : null
) as ViewStyle | null;

export function AxisWheel({
  level,
  onChange,
  startLabel,
  endLabel,
  centerLabel = '중간',
  nudge = false,
  accessibilityLabel,
  style,
}: AxisWheelProps) {
  const t = useTheme();
  const s = useStyles();
  const reduced = useReducedMotion();
  const [width, setWidth] = useState(0);
  const [held, setHeld] = useState(false);
  const [position, setPosition] = useState(level * STOP);
  const at = useRef(position);
  const frame = useRef(0);
  const touched = useRef(false);
  const tapped = useRef(0);
  const latest = useRef({ level, onChange, width });
  latest.current = { level, onChange, width };

  const move = (next: number) => {
    at.current = next;
    setPosition(next);
  };
  const ease = (to: number) => {
    cancelAnimationFrame(frame.current);
    const from = at.current;
    const started = Date.now();
    const run = () => {
      const k = Math.min(1, (Date.now() - started) / EASE);
      move(from + (to - from) * (1 - Math.pow(1 - k, 3)));
      if (k < 1) frame.current = requestAnimationFrame(run);
    };
    run();
  };
  const tell = (next: AxisLevel) => {
    if (next !== latest.current.level) latest.current.onChange(next);
  };
  const go = (next: AxisLevel) => {
    touched.current = true;
    tell(next);
    ease(next * STOP);
  };
  const actions = useRef({ move, ease, tell, go });
  actions.current = { move, ease, tell, go };

  useEffect(() => {
    if (levelAt(at.current) === level) return;
    if (reduced) {
      actions.current.move(level * STOP);
    } else {
      actions.current.ease(level * STOP);
    }
  }, [level, reduced]);

  useEffect(() => {
    if (!nudge || reduced) return undefined;
    let started = 0;
    const run = () => {
      if (touched.current) return;
      const k = Math.min(1, (Date.now() - started) / NUDGE_FOR);
      const base = latest.current.level * STOP;
      actions.current.move(
        base + Math.sin(k * Math.PI * 2) * NUDGE_BY * (1 - k)
      );
      if (k < 1) frame.current = requestAnimationFrame(run);
    };
    const timer = setTimeout(() => {
      started = Date.now();
      run();
    }, NUDGE_AT);
    return () => clearTimeout(timer);
  }, [nudge, reduced]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const pan = useMemo(() => {
    let from = 0;
    let left = 0;
    const perUnit = GAP / UNIT;
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => {
        cancelAnimationFrame(frame.current);
        touched.current = true;
        from = at.current;
        left = e.nativeEvent.locationX;
        setHeld(true);
      },
      onPanResponderMove: (_, g) => {
        const raw = from - g.dx / perUnit;
        const soft =
          raw > STOP
            ? STOP + (raw - STOP) * 0.3
            : raw < -STOP
              ? -STOP + (raw + STOP) * 0.3
              : raw;
        actions.current.move(soft);
        actions.current.tell(levelAt(soft));
      },
      onPanResponderRelease: (_, g) => {
        setHeld(false);
        if (Math.abs(g.dx) < TAP && Math.abs(g.dy) < TAP) {
          const now = Date.now();
          const twice = now - tapped.current < TWICE;
          tapped.current = twice ? 0 : now;
          const side = left / Math.max(1, latest.current.width) - 0.5;
          const step = Math.abs(side) > 0.14 ? Math.sign(side) : 0;
          const base = twice && !step ? 0 : levelAt(at.current) + step;
          actions.current.go(levelAt(base * STOP));
          return;
        }
        actions.current.go(levelAt(at.current - (g.vx * FLING) / perUnit));
      },
      onPanResponderTerminate: () => {
        setHeld(false);
        actions.current.go(levelAt(at.current));
      },
    });
  }, []);

  const lines = [];
  if (width > 0) {
    const mid = width / 2;
    const r = width * BEND;
    const turn = (GAP * 180) / (Math.PI * r * UNIT);
    const tall = (HEIGHT / 2 - 3) * (held ? 1 : REST);
    const span = Math.ceil(SIDE / turn / UNIT) * UNIT;
    const first = UNIT * Math.round(position / UNIT);
    for (let n = first - span; n <= first + span; n += UNIT) {
      const x = mid + r * Math.sin(rad((n - position) * turn));
      if (x < -6 || x > width + 6 || Math.abs(x - mid) < GAP * 0.42) continue;
      const u = Math.min(1, Math.abs(x - mid) / mid);
      const stop = n === 0 || Math.abs(n) === STOP;
      const env = tall * (1 - (1 - EDGE) * u * u) * (stop ? 1 : SHORT);
      const inside = Math.abs(n) <= STOP ? 1 : OUT;
      lines.push(
        <Line
          key={n}
          x1={x}
          x2={x}
          y1={HEIGHT / 2 - env}
          y2={HEIGHT / 2 + env}
          stroke={t.colors.title}
          strokeOpacity={(1 - DIM * Math.pow(u, 1.5)) * inside * 0.9}
          strokeWidth={stop ? STOP_TICK : TICK}
          strokeLinecap="round"
        />
      );
    }
  }
  const word = level < 0 ? startLabel : level > 0 ? endLabel : centerLabel;

  return (
    <View
      style={[s.root, style]}
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
    >
      <View
        {...pan.panHandlers}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{ min: -1, max: 1, now: level, text: word }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(e) =>
          go(
            levelAt(
              (level + (e.nativeEvent.actionName === 'increment' ? 1 : -1)) *
                STOP
            )
          )
        }
        style={[s.stage, noScroll]}
      >
        {width > 0 ? (
          <Svg width={width} height={HEIGHT} pointerEvents="none">
            {lines}
            <Line
              x1={width / 2}
              x2={width / 2}
              y1={NEEDLE / 2}
              y2={HEIGHT - NEEDLE / 2}
              stroke={t.colors.primary}
              strokeWidth={held ? NEEDLE + 0.8 : NEEDLE}
              strokeLinecap="round"
            />
          </Svg>
        ) : null}
      </View>
      <View style={s.ends} pointerEvents="box-none">
        {([-1, 1] as const).map((side) => (
          <PressableBase
            key={side}
            onPress={() => go(side)}
            accessibilityState={{ selected: level === side }}
            style={s.end}
          >
            <Text
              variant="bodyLg"
              weight={level === side ? 'semibold' : 'medium'}
              style={{
                color: level === side ? t.colors.title : t.colors.faint,
              }}
            >
              {side < 0 ? startLabel : endLabel}
            </Text>
          </PressableBase>
        ))}
      </View>
    </View>
  );
}
