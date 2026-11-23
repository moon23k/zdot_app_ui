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
  band: { flex: 1 },
}));

export function EdgeFade({ side, size, color, steps = STEPS }: EdgeFadeProps) {
  const s = useStyles();
  const across = side === 'right';
  return (
    <View
      pointerEvents="none"
      testID="edge-fade"
      style={[s[side], across ? { width: size } : { height: size }]}
    >
      {Array.from({ length: steps }, (_, i) => (
        <View
          key={i}
          style={[
            s.band,
            { backgroundColor: withAlpha(color, (i + 1) / (steps + 1)) },
          ]}
        />
      ))}
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
