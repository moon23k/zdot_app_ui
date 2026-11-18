import type { ReactNode } from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Photo } from '../../components/photo/photo';
import { Pill, type PillTone } from '../../components/pill/pill';
import { StarFillGlyph } from '../../internal/glyphs';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type ReviewCardProps = {
  rating: number;
  author: string;
  body: string;
  photos?: readonly string[];
  product?: { name: string; image?: string | null };
  status?: { label: string; tone?: PillTone };
  reply?: string;
  children?: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const STAR = 14;
const PHOTO = 56;
const THUMB = 28;
const MAX = 5;
const STAR_GAP = 1;

const useStyles = makeStyles((t) => ({
  root: {
    marginTop: t.space[2],
    paddingHorizontal: t.layout.screenX,
    paddingVertical: t.space[4] + t.space[1] / 2,
    gap: t.space[2],
    backgroundColor: t.colors.surface,
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: t.space[2] },
  stars: { flexDirection: 'row', gap: STAR_GAP },
  author: {
    flex: 1,
    fontFamily: t.fontFamily,
    fontSize: t.typography.eyebrow.fontSize,
    lineHeight: t.typography.eyebrow.lineHeight,
    color: t.colors.mutedForeground,
  },
  body: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.body.fontSize,
    lineHeight: t.typography.body.lineHeight,
    color: t.colors.title,
  },
  photos: { flexDirection: 'row', gap: t.space[1] + t.space[1] / 2 },
  photo: { width: PHOTO, height: PHOTO },
  product: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[2],
    marginTop: t.space[1],
  },
  thumb: { width: THUMB, height: THUMB },
  productName: {
    flexShrink: 1,
    fontFamily: t.fontFamily,
    fontSize: t.typography.eyebrow.fontSize,
    lineHeight: t.typography.eyebrow.lineHeight,
    color: t.colors.mutedForeground,
  },
  reply: {
    marginTop: t.space[1],
    paddingLeft: t.space[3],
    borderLeftWidth: 2,
    borderLeftColor: t.colors.muted,
    fontFamily: t.fontFamily,
    fontSize: t.typography.label.fontSize,
    lineHeight: t.typography.label.lineHeight,
    color: t.colors.mutedForeground,
  },
}));

export function ReviewCard({
  rating,
  author,
  body,
  photos = [],
  product,
  status,
  reply,
  children,
  onPress,
  style,
}: ReviewCardProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <PressableBase
      onPress={onPress}
      feedback="row"
      accessibilityLabel={`${rating}점, ${author}, ${body}`}
      style={[s.root, style]}
    >
      <View style={s.head}>
        <View style={s.stars}>
          {Array.from({ length: MAX }, (_, i) => (
            <StarFillGlyph
              key={i}
              color={i < rating ? t.colors.warning : t.colors.border}
              size={STAR}
            />
          ))}
        </View>
        <Text
          style={s.author}
          numberOfLines={1}
          maxFontSizeMultiplier={t.maxFontScale}
        >
          {author}
        </Text>
        {status ? <Pill tone={status.tone}>{status.label}</Pill> : null}
      </View>
      <Text style={s.body} maxFontSizeMultiplier={t.maxFontScale}>
        {body}
      </Text>
      {photos.length ? (
        <View style={s.photos}>
          {photos.map((uri) => (
            <Photo
              key={uri}
              source={{ uri }}
              radius={t.radius.md}
              style={s.photo}
            />
          ))}
        </View>
      ) : null}
      {product ? (
        <View style={s.product}>
          <Photo
            source={{ uri: product.image ?? '' }}
            seed={product.name}
            radius={t.radius.sm}
            style={s.thumb}
          />
          <Text
            style={s.productName}
            numberOfLines={1}
            maxFontSizeMultiplier={t.maxFontScale}
          >
            {product.name}
          </Text>
        </View>
      ) : null}
      {reply ? (
        <Text style={s.reply} maxFontSizeMultiplier={t.maxFontScale}>
          {reply}
        </Text>
      ) : null}
      {children}
    </PressableBase>
  );
}
