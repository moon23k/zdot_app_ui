import { View } from 'react-native';
import { makeStyles } from '../../utils/styles';

export type StudioStep = { key: string; label: string };

export type StudioStepsProps = {
  steps: readonly StudioStep[];
  current: string | null;
  done?: boolean;
};

const useStyles = makeStyles((t) => ({
  row: {
    flexDirection: 'row',
    gap: t.space[1],
    paddingHorizontal: t.space[4],
    paddingBottom: t.space[2],
  },
  track: {
    flex: 1,
    height: t.space[1],
    overflow: 'hidden',
    borderRadius: t.radius.full,
    backgroundColor: t.colors.muted,
  },
  fill: {
    height: '100%',
    borderRadius: t.radius.full,
    backgroundColor: t.colors.primary,
  },
  full: { width: '100%' },
  half: { width: '50%' },
}));

export function StudioSteps({ steps, current, done }: StudioStepsProps) {
  const s = useStyles();
  const at = done ? steps.length : steps.findIndex((x) => x.key === current);
  const now = steps[at];
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={now?.label}
      accessibilityValue={{ min: 0, max: steps.length, now: Math.max(0, at) }}
      style={s.row}
    >
      {steps.map((step, i) => (
        <View key={step.key} style={s.track}>
          {i < at ? (
            <View style={[s.fill, s.full]} />
          ) : i === at ? (
            <View style={[s.fill, s.half]} />
          ) : null}
        </View>
      ))}
    </View>
  );
}
