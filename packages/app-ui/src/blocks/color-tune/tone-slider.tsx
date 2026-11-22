import { useEffect, useMemo, useRef, useState } from 'react';
import {
  PanResponder,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { haptic } from '../../internal/haptics';
import { useReducedMotion } from '../../internal/use-reduced-motion';
import { useTheme } from '../../theme/theme-provider';
import { gradientStyle, makeStyles } from '../../utils/styles';

export type ToneSliderProps = {
  colors: readonly string[];
  value: number;
  origin?: number;
  labels?: readonly string[];
  accessibilityLabel: string;
  onValueChange: (index: number) => void;
  onScrub?: (position: number | null) => void;
  style?: StyleProp<ViewStyle>;
};

const TRACK = 10;
const KNOB = 22;
const MARK = 4;
const TOUCH = 44;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

const useStyles = makeStyles((t) => ({
  root: { height: TOUCH, justifyContent: 'center' },
  track: { height: TRACK, borderRadius: TRACK / 2 },
  mark: {
    position: 'absolute',
    top: (TOUCH - MARK) / 2,
    width: MARK,
    height: MARK,
    borderRadius: MARK / 2,
    backgroundColor: t.colors.raised,
  },
  knob: {
    position: 'absolute',
    top: (TOUCH - KNOB) / 2,
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: t.colors.raised,
    boxShadow: t.shadow.liftSm,
  },
}));

export function ToneSlider({
  colors,
  value,
  origin,
  labels,
  accessibilityLabel,
  onValueChange,
  onScrub,
  style,
}: ToneSliderProps) {
  const t = useTheme();
  const s = useStyles();
  const reduced = useReducedMotion();
  const [width, setWidth] = useState(0);
  const [live, setLive] = useState<number | null>(null);
  const last = Math.max(1, colors.length - 1);
  const latest = useRef({
    width,
    last,
    value,
    reduced,
    duration: t.motion.duration.move,
    onValueChange,
    onScrub,
  });
  latest.current = {
    width,
    last,
    value,
    reduced,
    duration: t.motion.duration.move,
    onValueChange,
    onScrub,
  };
  const frame = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

  const pan = useMemo(() => {
    let start = 0;
    let now = 0;
    let sent = 0;
    const stop = () => {
      if (frame.current !== null) {
        cancelAnimationFrame(frame.current);
        frame.current = null;
      }
    };
    const at = (x: number) => {
      const { width: w, last: n, value: v } = latest.current;
      const span = w - KNOB;
      return span > 0 ? clamp(((x - KNOB / 2) / span) * n, 0, n) : v;
    };
    const show = (p: number) => {
      now = p;
      setLive(p);
      latest.current.onScrub?.(p);
      const near = Math.round(p);
      if (near !== sent) {
        sent = near;
        haptic('select');
        latest.current.onValueChange(near);
      }
    };
    const rest = () => {
      frame.current = null;
      setLive(null);
      latest.current.onScrub?.(null);
    };
    const settle = () => {
      const from = now;
      const to = Math.round(from);
      const { reduced: still, duration } = latest.current;
      if (still || from === to) {
        rest();
        return;
      }
      const begin = Date.now();
      const step = () => {
        const k = Math.min(1, (Date.now() - begin) / duration);
        if (k >= 1) {
          rest();
          return;
        }
        const p = from + (to - from) * (1 - (1 - k) ** 3);
        setLive(p);
        latest.current.onScrub?.(p);
        frame.current = requestAnimationFrame(step);
      };
      frame.current = requestAnimationFrame(step);
    };
    return {
      stop,
      responder: PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > Math.abs(g.dy),
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (e) => {
          stop();
          start = e.nativeEvent.locationX;
          sent = latest.current.value;
          show(at(start));
        },
        onPanResponderMove: (_, g) => show(at(start + g.dx)),
        onPanResponderRelease: settle,
        onPanResponderTerminate: settle,
      }),
    };
  }, []);

  useEffect(() => pan.stop, [pan]);

  const span = Math.max(0, width - KNOB);
  const x = (p: number) => KNOB / 2 + (p / last) * span;
  const stops = colors
    .map((c, i) => {
      const share = width > 0 ? x(i) / width : i / last;
      return `${c} ${(share * 100).toFixed(2)}%`;
    })
    .join(', ');
  const fill =
    colors.length > 1
      ? gradientStyle(`linear-gradient(90deg, ${stops})`)
      : { backgroundColor: colors[0] };
  const shown = clamp(live ?? value, 0, last);
  const mark = origin !== undefined && origin !== value && width > 0;

  return (
    <View
      {...pan.responder.panHandlers}
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{
        min: 0,
        max: last,
        now: value,
        text: labels?.[value],
      }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => {
        const next = clamp(
          value + (e.nativeEvent.actionName === 'increment' ? 1 : -1),
          0,
          last
        );
        if (next !== value) onValueChange(next);
      }}
      style={[s.root, style]}
    >
      <View pointerEvents="none" style={[s.track, fill]} />
      {mark ? (
        <View
          pointerEvents="none"
          style={[s.mark, { left: x(origin) - MARK / 2 }]}
        />
      ) : null}
      {width > 0 ? (
        <View
          testID="tone-slider-knob"
          pointerEvents="none"
          style={[s.knob, { left: x(shown) - KNOB / 2 }]}
        />
      ) : null}
    </View>
  );
}
