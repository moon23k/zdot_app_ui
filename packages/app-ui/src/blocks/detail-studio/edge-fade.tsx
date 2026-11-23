import { View } from 'react-native';
import { withAlpha } from '../../utils/color';
import { makeStyles } from '../../utils/styles';

export type EdgeFadeProps = {
  side: 'right' | 'bottom';
  size: number;
  color: string;
  steps?: number;
};

const STEPS = 12;

const useStyles = makeStyles(() => ({
  right: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  band: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
}));

export function fadeLayers(steps: number): number[] {
  const out: number[] = [];
  let shown = 0;
  for (let i = 0; i < steps; i++) {
    const goal = (i + 1) / (steps + 1);
    out.push(1 - (1 - goal) / (1 - shown));
    shown = goal;
  }
  return out;
}

export function EdgeFade({ side, size, color, steps = STEPS }: EdgeFadeProps) {
  const s = useStyles();
  const across = side === 'right';
  const layers = fadeLayers(steps);
  return (
    <View
      pointerEvents="none"
      testID="edge-fade"
      style={[s[side], across ? { width: size } : { height: size }]}
    >
      {layers.map((alpha, i) => {
        const start = (size * i) / steps;
        return (
          <View
            key={i}
            style={[
              s.band,
              across ? { left: start } : { top: start },
              { backgroundColor: withAlpha(color, alpha) },
            ]}
          />
        );
      })}
    </View>
  );
}

export function hasMore(
  offset: number,
  view: number,
  content: number,
  slack = 1
): boolean {
  return content - (offset + view) > slack;
}
