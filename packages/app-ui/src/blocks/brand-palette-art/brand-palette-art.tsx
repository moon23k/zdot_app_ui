import { View } from 'react-native';
import { Text } from '../../components/text/text';
import { makeStyles } from '../../utils/styles';

export type BrandSwatch = { label: string; color: string; ink: string };

export type BrandPaletteArtProps = {
  width: number;
  label: string;
  name: string;
  primary: string;
  onPrimary: string;
  swatches: readonly BrandSwatch[];
};

const RATIO = 400 / 328;

const useStyles = makeStyles((t) => ({
  root: {
    borderRadius: t.radius.xl,
    overflow: 'hidden',
    backgroundColor: t.colors.surface,
  },
  main: { flex: 1, padding: t.space[6], justifyContent: 'space-between' },
  name: { gap: t.space[2] },
  soft: { opacity: 0.8 },
  row: { flexDirection: 'row', height: 112 },
  swatch: {
    flex: 1,
    padding: t.space[3],
    justifyContent: 'flex-end',
    gap: t.space[1],
  },
}));

export function BrandPaletteArt({
  width,
  label,
  name,
  primary,
  onPrimary,
  swatches,
}: BrandPaletteArtProps) {
  const s = useStyles();
  const ink = { color: onPrimary };
  return (
    <View style={[s.root, { width, height: width * RATIO }]}>
      <View style={[s.main, { backgroundColor: primary }]}>
        <Text variant="label" style={[ink, s.soft]}>
          {label}
        </Text>
        <View style={s.name}>
          <Text variant="display" style={ink}>
            {name}
          </Text>
          <Text variant="caption" style={[ink, s.soft]}>
            {primary.toUpperCase()}
          </Text>
        </View>
      </View>
      <View style={s.row}>
        {swatches.map((swatch) => (
          <View
            key={swatch.label}
            style={[s.swatch, { backgroundColor: swatch.color }]}
          >
            <Text
              variant="caption"
              weight="semibold"
              style={{ color: swatch.ink }}
            >
              {swatch.label}
            </Text>
            <Text variant="caption" style={[{ color: swatch.ink }, s.soft]}>
              {swatch.color.toUpperCase()}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
