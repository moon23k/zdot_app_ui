import { View, type ImageSourcePropType } from 'react-native';
import { Photo } from '../components/photo/photo';
import { Text } from '../components/text/text';
import { makeStyles } from '../utils/styles';
import { AxisRing } from './dial-strip';

export type BrandFeelAxis = { key: string; label: string; value: number };

export type BrandFeelSample = {
  primary: string;
  onPrimary: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  radius: number;
  buttonRadius: number;
  photoRatio: number;
  button: string;
  image?: ImageSourcePropType;
};

export type BrandFeelArtProps = {
  width: number;
  axes: readonly BrandFeelAxis[];
  strong: readonly string[];
  sample: BrandFeelSample;
  captions: readonly string[];
};

const RATIO = 400 / 328;

const useStyles = makeStyles((t) => ({
  root: {
    backgroundColor: t.colors.surface,
    borderRadius: t.radius.xl,
    padding: t.space[5],
    gap: t.space[5],
  },
  rings: { flexDirection: 'row', justifyContent: 'space-between' },
  ring: { alignItems: 'center', gap: t.space[1] },
  box: {
    flex: 1,
    borderRadius: t.radius.lg,
    padding: t.space[4],
    gap: t.space[3],
    justifyContent: 'flex-end',
  },
  body: { flexDirection: 'row', alignItems: 'flex-end', gap: t.space[3] },
  photo: { width: '46%', overflow: 'hidden' },
  side: { flex: 1, gap: t.space[2] },
  bar: { height: t.space[2], borderRadius: t.radius.full },
  long: { width: '90%' },
  short: { width: '60%' },
  button: {
    height: t.space[10],
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: t.space[3],
    marginTop: t.space[1],
  },
  captions: { flexDirection: 'row', justifyContent: 'space-between' },
}));

export function BrandFeelArt({
  width,
  axes,
  strong,
  sample,
  captions,
}: BrandFeelArtProps) {
  const s = useStyles();
  return (
    <View style={[s.root, { width, height: width * RATIO }]}>
      <View style={s.rings}>
        {axes.map((axis) => {
          const on = strong.includes(axis.key);
          return (
            <View key={axis.key} style={s.ring}>
              <AxisRing value={axis.value} on={on} />
              <Text
                variant="caption"
                weight={on ? 'bold' : 'regular'}
                tone={on ? 'default' : 'muted'}
              >
                {axis.label}
              </Text>
            </View>
          );
        })}
      </View>
      <View style={[s.box, { backgroundColor: sample.surface }]}>
        <View style={s.body}>
          <View
            style={[
              s.photo,
              {
                borderRadius: sample.radius,
                backgroundColor: sample.surfaceAlt,
              },
            ]}
          >
            {sample.image ? (
              <Photo
                source={sample.image}
                aspectRatio={sample.photoRatio}
                radius={sample.radius}
                resizeMode="contain"
              />
            ) : (
              <View style={{ aspectRatio: sample.photoRatio }} />
            )}
          </View>
          <View style={s.side}>
            <View style={[s.bar, s.long, { backgroundColor: sample.border }]} />
            <View
              style={[s.bar, s.short, { backgroundColor: sample.border }]}
            />
            <View
              style={[
                s.button,
                {
                  borderRadius: sample.buttonRadius,
                  backgroundColor: sample.primary,
                },
              ]}
            >
              <Text
                variant="label"
                weight="semibold"
                numberOfLines={1}
                style={{ color: sample.onPrimary }}
              >
                {sample.button}
              </Text>
            </View>
          </View>
        </View>
        <View style={s.captions}>
          {captions.map((caption) => (
            <Text key={caption} variant="caption" tone="muted">
              {caption}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}
