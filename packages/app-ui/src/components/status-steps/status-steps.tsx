import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { DrawnCheck } from '../../internal/drawn-check';
import { FILL_FROM, usePop, useSwitch } from '../../internal/motion';
import { Pulse } from '../../internal/pulse';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';
import { Text } from '../text/text';

export type StatusStepsProps = {
  steps: readonly string[];
  current: number;
  orientation?: 'horizontal' | 'vertical';
  times?: readonly (string | null | undefined)[];
  notes?: readonly (string | null | undefined)[];
  done?: boolean;
  due?: boolean;
  style?: StyleProp<ViewStyle>;
};

const MARK = 20;
const DOT = 8;
const NOW = 8;
const LINE = 2;
const CHECK = 12;
const HDOT = 12;
const HALO = 4;
const SPREAD = 7;

const useStyles = makeStyles((t) => ({
  row: { flexDirection: 'row', paddingVertical: t.space[2] },
  step: { flex: 1, alignItems: 'center', gap: t.space[1] + t.space[1] / 2 },
  line: {
    position: 'absolute',
    top: MARK / 2 - LINE / 2,
    height: LINE,
    width: '50%',
    backgroundColor: t.colors.muted,
  },
  left: { left: 0 },
  right: { right: 0 },
  fill: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: t.colors.primaryContainer,
  },
  fromLeft: { transformOrigin: 'left' },
  fromTop: { transformOrigin: 'top' },
  center: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mark: {
    width: MARK,
    height: MARK,
    borderRadius: MARK / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markDone: { backgroundColor: t.colors.primary },
  markNow: { backgroundColor: t.colors.primaryTint },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: t.colors.input,
  },
  hdot: {
    width: HDOT,
    height: HDOT,
    borderRadius: HDOT / 2,
    backgroundColor: t.colors.input,
  },
  hdotOn: { backgroundColor: t.colors.primary },
  hdotNow: {
    width: HDOT + HALO * 2,
    height: HDOT + HALO * 2,
    borderRadius: (HDOT + HALO * 2) / 2,
    borderWidth: HALO,
    borderColor: t.colors.primaryTint,
    backgroundColor: t.colors.primary,
  },
  dotNow: {
    width: NOW,
    height: NOW,
    borderRadius: NOW / 2,
    backgroundColor: t.colors.primary,
  },
  column: { gap: 0 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[3],
    paddingBottom: t.space[3] + t.space[1] / 2,
  },
  last: { paddingBottom: 0 },
  rail: {
    position: 'absolute',
    left: MARK / 2 - LINE / 2,
    top: MARK,
    bottom: 0,
    width: LINE,
    backgroundColor: t.colors.muted,
  },
  label: { flex: 1 },
  title: { color: t.colors.title },
  todo: { color: t.colors.ring },
  due: { color: t.colors.warningText },
  small: {
    fontSize: t.typography.eyebrow.fontSize,
    lineHeight: t.typography.eyebrow.lineHeight,
  },
}));

type State = 'done' | 'now' | 'todo';

function Fill({ on, axis }: { on: boolean; axis: 'x' | 'y' }) {
  const s = useStyles();
  const grow = useSwitch(on, 'long');
  const fill = useAnimatedStyle(() =>
    axis === 'x'
      ? { transform: [{ scaleX: grow.value }] }
      : { transform: [{ scaleY: grow.value }] }
  );
  return (
    <Animated.View
      pointerEvents="none"
      style={[s.fill, axis === 'x' ? s.fromLeft : s.fromTop, fill]}
    />
  );
}

function Dot({ state }: { state: State }) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View style={s.mark}>
      {state === 'now' ? (
        <Pulse
          size={HDOT + HALO * 2}
          spread={SPREAD}
          color={t.colors.primary}
        />
      ) : null}
      <View
        style={
          state === 'now' ? s.hdotNow : [s.hdot, state === 'done' && s.hdotOn]
        }
      />
    </View>
  );
}

function Mark({ state }: { state: State }) {
  const t = useTheme();
  const s = useStyles();
  const done = state === 'done';
  const pop = usePop(done, FILL_FROM);
  return (
    <Animated.View
      style={[s.mark, done ? s.markDone : state === 'now' && s.markNow, pop]}
    >
      {state === 'now' ? (
        <>
          <Pulse size={MARK} spread={SPREAD} color={t.colors.primary} />
          <View style={s.dotNow} />
        </>
      ) : state === 'todo' ? (
        <View style={s.dot} />
      ) : null}
      <View style={s.center}>
        <DrawnCheck
          on={done}
          color={t.colors.primaryForeground}
          size={CHECK}
          draw="long"
        />
      </View>
    </Animated.View>
  );
}

export function StatusSteps({
  steps,
  current,
  orientation = 'horizontal',
  times,
  notes,
  done = false,
  due = true,
  style,
}: StatusStepsProps) {
  const s = useStyles();
  const index = Math.min(Math.max(current, 0), steps.length - 1);
  const last = steps.length - 1;
  const stateOf = (i: number): State =>
    i < index || (done && i === index) ? 'done' : i === index ? 'now' : 'todo';
  const a11y = {
    accessible: true,
    accessibilityRole: 'progressbar' as const,
    accessibilityLabel: `${steps.length}단계 중 ${index + 1}단계, ${steps[index] ?? ''}`,
    accessibilityValue: { min: 1, max: steps.length, now: index + 1 },
  };
  if (orientation === 'vertical') {
    return (
      <View style={[s.column, style]} {...a11y}>
        {steps.map((label, i) => {
          const state = stateOf(i);
          return (
            <View key={`${label}-${i}`} style={[s.item, i === last && s.last]}>
              {i < last ? (
                <View style={s.rail}>
                  <Fill on={state === 'done'} axis="y" />
                </View>
              ) : null}
              <Mark state={state} />
              <Text
                weight={state === 'now' ? 'semibold' : undefined}
                style={[
                  s.label,
                  state === 'now' && s.title,
                  state === 'todo' && s.todo,
                ]}
                numberOfLines={1}
              >
                {label}
                {notes?.[i] ? (
                  <Text weight="regular" tone="muted">{`  ${notes[i]}`}</Text>
                ) : null}
              </Text>
              {times?.[i] ? (
                <Text
                  variant="caption"
                  weight={state === 'now' && due ? 'medium' : undefined}
                  tone="muted"
                  style={state === 'now' && due && s.due}
                >
                  {times[i]}
                </Text>
              ) : null}
            </View>
          );
        })}
      </View>
    );
  }
  return (
    <View style={[s.row, style]} {...a11y}>
      {steps.map((label, i) => {
        const state = stateOf(i);
        return (
          <View key={`${label}-${i}`} style={s.step}>
            {i > 0 ? (
              <View style={[s.line, s.left]}>
                <Fill on={i <= index} axis="x" />
              </View>
            ) : null}
            {i < last ? (
              <View style={[s.line, s.right]}>
                <Fill on={i < index} axis="x" />
              </View>
            ) : null}
            <Dot state={state} />
            <Text
              weight={state === 'now' ? 'semibold' : undefined}
              style={[s.small, state === 'now' ? s.title : s.todo]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
