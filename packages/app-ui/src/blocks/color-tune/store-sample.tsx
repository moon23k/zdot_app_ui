import { memo } from 'react';
import {
  Image,
  Text,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme/theme-provider';
import { contrastRatio, pickForeground } from '../../utils/color';
import { makeStyles } from '../../utils/styles';
import { Won } from '../../components/text/figures';
import type { PaletteColors } from '../palette-block/palette-block';

export type StoreSampleItem = {
  key: string;
  name: string;
  price: string;
  source: ImageSourcePropType;
};

export type StoreSampleProps = {
  colors: PaletteColors;
  name: string;
  categories: readonly string[];
  badge?: string;
  hero: ImageSourcePropType;
  items: readonly StoreSampleItem[];
  style?: StyleProp<ViewStyle>;
};

const INK = '#111111';
const WHITE = '#ffffff';
const ON_CONTRAST = 4.5;
const RADIUS = 22;
const TOP = 11;
const TITLE_SIZE = 18;
const TITLE_LEADING = 24;
const TITLE_TRACKING = -0.22;
const BAG = 20;
const BAG_STROKE = 1.5;
const CHIPS_TOP = 17;
const CHIP = 28;
const CHIP_GAP = 6;
const CHIP_SIZE = 13;
const CHIP_LEADING = 18;
const HERO_TOP = 14;
const HERO = 150;
const HERO_RADIUS = 14;
const BADGE = 22;
const BADGE_SIZE = 12;
const BADGE_TRACKING = 0.12;
const GRID_TOP = 14;
const GRID_GAP = 10;
const ROW_GAP = 16;
const PHOTO_RADIUS = 12;
const ITEM_SIZE = 13;
const ITEM_LEADING = 18;
const PRICE_SIZE = 14;
const PRICE_LEADING = 20;
const PRICE_TRACKING = -0.06;

const useStyles = makeStyles((t) => ({
  root: { borderRadius: RADIUS, boxShadow: t.shadow.lift },
  clip: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: RADIUS,
    overflow: 'hidden',
    paddingHorizontal: t.space[4],
    paddingTop: TOP,
  },
  head: {
    height: TITLE_LEADING,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: t.fontFamily,
    fontSize: TITLE_SIZE,
    lineHeight: TITLE_LEADING,
    letterSpacing: TITLE_TRACKING,
    fontWeight: '600',
  },
  chips: {
    flexDirection: 'row',
    gap: CHIP_GAP,
    marginTop: CHIPS_TOP,
  },
  chip: {
    height: CHIP,
    justifyContent: 'center',
    paddingHorizontal: t.space[3],
    borderRadius: CHIP / 2,
  },
  chipText: {
    fontFamily: t.fontFamily,
    fontSize: CHIP_SIZE,
    lineHeight: CHIP_LEADING,
  },
  strong: { fontWeight: '600' },
  hero: { marginTop: HERO_TOP },
  heroPhoto: { width: '100%', height: HERO, borderRadius: HERO_RADIUS },
  badge: {
    position: 'absolute',
    top: t.space[3],
    left: t.space[3],
    height: BADGE,
    justifyContent: 'center',
    paddingHorizontal: t.space[2],
    borderRadius: BADGE / 2,
  },
  badgeText: {
    fontFamily: t.fontFamily,
    fontSize: BADGE_SIZE,
    lineHeight: BADGE,
    letterSpacing: BADGE_TRACKING,
    fontWeight: '600',
  },
  grid: { gap: ROW_GAP, marginTop: GRID_TOP },
  row: { flexDirection: 'row', gap: GRID_GAP },
  item: { flex: 1, minWidth: 0 },
  photo: { width: '100%', aspectRatio: 1, borderRadius: PHOTO_RADIUS },
  itemName: {
    marginTop: t.space[2],
    fontFamily: t.fontFamily,
    fontSize: ITEM_SIZE,
    lineHeight: ITEM_LEADING,
  },
  bag: { width: BAG, height: BAG },
  handle: {
    position: 'absolute',
    left: BAG * 0.37,
    top: BAG * 0.16,
    width: BAG * 0.26,
    height: BAG * 0.24,
    borderWidth: BAG_STROKE,
    borderBottomWidth: 0,
    borderTopLeftRadius: BAG * 0.13,
    borderTopRightRadius: BAG * 0.13,
  },
  sack: {
    position: 'absolute',
    left: BAG * 0.22,
    top: BAG * 0.35,
    width: BAG * 0.56,
    height: BAG * 0.46,
    borderWidth: BAG_STROKE,
    borderBottomLeftRadius: BAG * 0.08,
    borderBottomRightRadius: BAG * 0.08,
  },
  price: {
    fontFamily: t.fontFamily,
    fontSize: PRICE_SIZE,
    lineHeight: PRICE_LEADING,
    letterSpacing: PRICE_TRACKING,
    fontWeight: '500',
  },
}));

function Bag({ color }: { color: string }) {
  const s = useStyles();
  return (
    <View style={s.bag}>
      <View style={[s.handle, { borderColor: color }]} />
      <View style={[s.sack, { borderColor: color }]} />
    </View>
  );
}

function StoreSampleView({
  colors,
  name,
  categories,
  badge,
  hero,
  items,
  style,
}: StoreSampleProps) {
  const t = useTheme();
  const s = useStyles();
  const onMain = pickForeground(colors.main, INK, WHITE);
  const onAccent =
    contrastRatio(colors.accent, WHITE) >= ON_CONTRAST ? WHITE : INK;
  const scale = t.maxFontScale;
  const rows: StoreSampleItem[][] = [];
  items.forEach((item, i) => {
    if (i % 2 === 0) rows.push([item]);
    else rows[rows.length - 1]!.push(item);
  });
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      aria-hidden
      style={[s.root, { backgroundColor: colors.background }, style]}
    >
      <View style={[s.clip, { backgroundColor: colors.background }]}>
        <View style={s.head}>
          <Text
            numberOfLines={1}
            maxFontSizeMultiplier={scale}
            style={[s.title, { color: colors.main }]}
          >
            {name}
          </Text>
          <Bag color={colors.text} />
        </View>
        <View style={s.chips}>
          {categories.map((label, i) => (
            <View
              key={label}
              style={[
                s.chip,
                {
                  backgroundColor: i === 0 ? colors.main : colors.secondary,
                },
              ]}
            >
              <Text
                numberOfLines={1}
                maxFontSizeMultiplier={scale}
                style={[
                  s.chipText,
                  i === 0 && s.strong,
                  { color: i === 0 ? onMain : colors.text },
                ]}
              >
                {label}
              </Text>
            </View>
          ))}
        </View>
        <View style={s.hero}>
          <Image source={hero} resizeMode="cover" style={s.heroPhoto} />
          {badge ? (
            <View style={[s.badge, { backgroundColor: colors.accent }]}>
              <Text
                maxFontSizeMultiplier={scale}
                style={[s.badgeText, { color: onAccent }]}
              >
                {badge}
              </Text>
            </View>
          ) : null}
        </View>
        <View style={s.grid}>
          {rows.map((row) => (
            <View key={row[0]!.key} style={s.row}>
              {row.map((item) => (
                <View key={item.key} style={s.item}>
                  <Image
                    source={item.source}
                    resizeMode="cover"
                    style={s.photo}
                  />
                  <Text
                    numberOfLines={1}
                    maxFontSizeMultiplier={scale}
                    style={[s.itemName, { color: colors.text }]}
                  >
                    {item.name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    maxFontSizeMultiplier={scale}
                    style={[s.price, { color: colors.text }]}
                  >
                    <Won size={PRICE_SIZE} tracking={PRICE_TRACKING}>
                      {item.price}
                    </Won>
                  </Text>
                </View>
              ))}
              {row.length === 1 ? <View style={s.item} /> : null}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export const StoreSample = memo(StoreSampleView);
