import { View } from 'react-native';
import { makeStyles } from '../../utils/styles';

export type ToneStripProps = {
  colors: readonly string[];
  label?: string;
};

const HEIGHT = 48;

const useStyles = makeStyles((t) => ({
  row: {
    flexDirection: 'row',
    height: HEIGHT,
    overflow: 'hidden',
    borderRadius: t.radius.lg,
  },
  cell: { flex: 1 },
}));

export function ToneStrip({ colors, label = '톤 단계' }: ToneStripProps) {
  const s = useStyles();
  return (
    <View accessibilityRole="image" accessibilityLabel={label} style={s.row}>
      {colors.map((color, i) => (
        <View
          key={`${i}-${color}`}
          style={[s.cell, { backgroundColor: color }]}
        />
      ))}
    </View>
  );
}
