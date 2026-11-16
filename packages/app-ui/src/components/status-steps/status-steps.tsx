import { View, type StyleProp, type ViewStyle } from 'react-native';
import { CheckGlyph } from '../../internal/glyphs';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';
import { Text } from '../text/text';

export type StatusStepsProps = {
  steps: readonly string[];
  current: number;
  orientation?: 'horizontal' | 'vertical';
  times?: readonly (string | null | undefined)[];
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
  lineDone: { backgroundColor: t.colors.primaryContainer },
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

function Dot({ state }: { state: State }) {
  const s = useStyles();
  return (
    <View key={state} style={s.mark}>
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
  if (state === 'done') {
    return (
      <View key="done" style={[s.mark, s.markDone]}>
        <CheckGlyph color={t.colors.primaryForeground} size={CHECK} />
      </View>
    );
  }
  return (
    <View key={state} style={[s.mark, state === 'now' && s.markNow]}>
      <View style={state === 'now' ? s.dotNow : s.dot} />
    </View>
  );
}

export function StatusSteps({
  steps,
  current,
  orientation = 'horizontal',
  times,
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
                <View style={[s.rail, state === 'done' && s.lineDone]} />
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
              <View style={[s.line, s.left, i <= index && s.lineDone]} />
            ) : null}
            {i < last ? (
              <View style={[s.line, s.right, i < index && s.lineDone]} />
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
