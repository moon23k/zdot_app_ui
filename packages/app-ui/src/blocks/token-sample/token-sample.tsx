import { View } from 'react-native';
import { makeStyles } from '../../utils/styles';

export type TokenSampleProps =
  | { kind: 'surface' | 'emphasis'; color: string }
  | { kind: 'button'; color: string; radius: number }
  | { kind: 'spacing'; gap: number }
  | { kind: 'ratio'; color: string; ratio: number };

const useStyles = makeStyles((t) => ({
  chip: {
    width: 40,
    height: 26,
    borderRadius: t.radius.sm,
    borderWidth: 1,
    borderColor: t.colors.border,
  },
  button: { width: 56, height: 26 },
  bars: { flexDirection: 'row' },
  bar: {
    width: 9,
    height: 26,
    borderRadius: t.radius.sm,
    backgroundColor: t.colors.border,
  },
  ratio: {
    height: 28,
    borderRadius: t.radius.sm,
    borderWidth: 1,
    borderColor: t.colors.border,
  },
}));

export function TokenSample(props: TokenSampleProps) {
  const s = useStyles();
  if (props.kind === 'button') {
    return (
      <View
        style={[
          s.button,
          { borderRadius: props.radius, backgroundColor: props.color },
        ]}
      />
    );
  }
  if (props.kind === 'spacing') {
    return (
      <View style={[s.bars, { gap: props.gap }]}>
        <View style={s.bar} />
        <View style={s.bar} />
        <View style={s.bar} />
      </View>
    );
  }
  if (props.kind === 'ratio') {
    return (
      <View
        style={[
          s.ratio,
          { aspectRatio: props.ratio, backgroundColor: props.color },
        ]}
      />
    );
  }
  return <View style={[s.chip, { backgroundColor: props.color }]} />;
}
