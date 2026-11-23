import { Text as RNText, View, type ViewStyle } from 'react-native';
import { CloseGlyph } from '../../internal/glyphs';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type ColumnsArtProps = { count: number; color: string };

export type RatioArtProps = { width: number; height: number; color: string };

export type LevelsArtProps = { levels: readonly number[]; color: string };

export type SlashArtProps = { color: string };

export type PlacementSpot = 'center' | 'corner' | 'band';

export type PlacementArtProps = {
  spot: PlacementSpot;
  color: string;
  scale?: number;
  dim?: boolean;
};

export type PlacementThumbProps = {
  spot: PlacementSpot;
  scale?: number;
  dim?: boolean;
};

export type FooterArtProps = { text: boolean; color: string };

export type SampleArtProps = { text: string; color: string; strike?: boolean };

const useStyles = makeStyles((t) => ({
  box: {
    width: t.space[10],
    height: t.space[6],
    flexDirection: 'row',
    gap: t.space[1],
  },
  levels: {
    width: t.space[10],
    height: t.space[6],
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: t.space[1],
  },
  bar: { flex: 1, borderRadius: t.space[1] / 2 },
  level: { width: t.space[2], borderRadius: t.space[1] / 2 },
  ratio: {
    height: t.space[8],
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: { height: t.space[8], borderRadius: t.space[1] / 2 },
  sample: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.label.fontSize,
    lineHeight: t.space[6],
    fontWeight: '600',
  },
  strike: { textDecorationLine: 'line-through' },
  thumb: {
    width: t.space[10] + t.space[2],
    height: t.space[12] + t.space[2],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: t.radius.md,
    backgroundColor: t.colors.recess,
  },
  thumbPhone: { width: t.space[6], height: t.space[10] },
  pair: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: t.space[1] + t.space[1] / 2,
  },
  web: { width: t.space[12], height: t.space[8] },
  phone: { width: t.space[4], height: t.space[8] },
  outline: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderWidth: 1.5,
    borderRadius: t.space[1],
    opacity: 0.55,
  },
  shade: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: t.space[1],
    opacity: 0.22,
  },
  spot: { position: 'absolute', borderRadius: t.space[1] / 2 },
  footer: {
    width: t.space[12],
    height: t.space[6],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: t.space[2],
    paddingHorizontal: t.space[1],
    borderTopWidth: 1.5,
  },
  footerText: {
    flex: 1,
    height: t.space[1],
    borderRadius: t.space[1],
  },
  slash: {
    width: t.space[6],
    height: t.space[6],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: t.space[1] / 2,
    overflow: 'hidden',
  },
  slashLine: {
    width: t.space[8],
    height: 1.5,
    transform: [{ rotate: '-45deg' }],
  },
}));

export function ColumnsArt({ count, color }: ColumnsArtProps) {
  const s = useStyles();
  return (
    <View style={s.box}>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={[s.bar, { backgroundColor: color }]} />
      ))}
    </View>
  );
}

export function RatioArt({ width, height, color }: RatioArtProps) {
  const s = useStyles();
  return (
    <View style={s.ratio}>
      <View
        style={[
          s.frame,
          { aspectRatio: width / height, backgroundColor: color },
        ]}
      />
    </View>
  );
}

export function LevelsArt({ levels, color }: LevelsArtProps) {
  const s = useStyles();
  const top = Math.max(1, ...levels);
  return (
    <View style={s.levels}>
      {levels.map((level, i) => (
        <View
          key={i}
          style={[
            s.level,
            { height: `${(level / top) * 100}%`, backgroundColor: color },
          ]}
        />
      ))}
    </View>
  );
}

export function SampleArt({ text, color, strike }: SampleArtProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <RNText
      numberOfLines={1}
      maxFontSizeMultiplier={t.maxFontScale}
      style={[s.sample, strike && s.strike, { color }]}
    >
      {text}
    </RNText>
  );
}

export function SlashArt({ color }: SlashArtProps) {
  const s = useStyles();
  return (
    <View style={[s.slash, { borderColor: color }]}>
      <View style={[s.slashLine, { backgroundColor: color }]} />
    </View>
  );
}

const EDGE = 3;

function spotBox(
  spot: PlacementSpot,
  phone: boolean,
  scale: number
): ViewStyle {
  const grow = (n: number) => `${Math.min(100, n * scale)}%` as const;
  if (spot === 'band') {
    return { left: 0, right: 0, bottom: 0, height: grow(22) };
  }
  if (spot === 'corner') {
    return phone
      ? { left: 0, right: 0, bottom: 0, height: grow(36) }
      : { right: EDGE, bottom: EDGE, width: grow(32), height: grow(50) };
  }
  const width = phone ? 78 * Math.min(1, scale) : 40 * scale;
  const height = phone ? 38 * scale : 46 * scale;
  return {
    left: `${(100 - Math.min(100, width)) / 2}%`,
    top: `${(100 - Math.min(100, height)) / 2}%`,
    width: `${Math.min(100, width)}%`,
    height: `${Math.min(100, height)}%`,
  };
}

function Screen({
  phone,
  spot,
  color,
  scale,
  dim,
  style,
}: Required<PlacementArtProps> & { phone: boolean; style?: ViewStyle }) {
  const s = useStyles();
  return (
    <View style={style ?? (phone ? s.phone : s.web)}>
      {dim ? <View style={[s.shade, { backgroundColor: color }]} /> : null}
      <View style={[s.outline, { borderColor: color }]} />
      <View
        style={[
          s.spot,
          spotBox(spot, phone, scale),
          { backgroundColor: color },
        ]}
      />
    </View>
  );
}

export function PlacementArt({
  spot,
  color,
  scale = 1,
  dim = false,
}: PlacementArtProps) {
  const s = useStyles();
  return (
    <View style={s.pair}>
      <Screen phone={false} spot={spot} color={color} scale={scale} dim={dim} />
      <Screen phone spot={spot} color={color} scale={scale} dim={dim} />
    </View>
  );
}

export function FooterArt({ text, color }: FooterArtProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View style={[s.footer, { borderTopColor: color }]}>
      {text ? (
        <View style={[s.footerText, { backgroundColor: color }]} />
      ) : null}
      <CloseGlyph color={color} size={t.iconSize.sm} />
    </View>
  );
}

export function PlacementThumb({
  spot,
  scale = 1,
  dim = false,
}: PlacementThumbProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View style={s.thumb}>
      <Screen
        phone
        spot={spot}
        color={t.colors.faint}
        scale={scale}
        dim={dim}
        style={s.thumbPhone}
      />
    </View>
  );
}
