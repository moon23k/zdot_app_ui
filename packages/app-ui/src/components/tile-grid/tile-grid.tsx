import { useState } from 'react';
import {
  Image,
  type ImageSourcePropType,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { CheckDisc } from '../../internal/check-disc';
import { haptic } from '../../internal/haptics';
import { timing, useSwitch } from '../../internal/motion';
import { PressableBase } from '../../internal/pressable-base';
import { nextSingle } from '../../internal/selection';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type TileGridItem<T extends string> = {
  value: T;
  label: string;
  caption?: string;
  uri?: string | null;
  source?: ImageSourcePropType;
};

export type TileGridProps<T extends string> = {
  items: readonly TileGridItem<T>[];
  value: T | null;
  onValueChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
};

const TILE = 112;
const PLATE = 104;
const PLATE_RIGHT = -18;
const PLATE_BOTTOM = -22;
const PHOTO = 68;
const PHOTO_RIGHT = 6;
const PHOTO_BOTTOM = 4;
const PHOTO_SHADOW = 'drop-shadow(0px 6px 6px rgba(17, 24, 39, 0.14))';
const INSET_X = 14;
const CAPTION_TOP = 12;
const NAME_TOP = 32;
const NAME_WIDTH = 88;
const NAME_SIZE = 16;
const NAME_LEADING = 21;
const NAME_TRACKING = -0.3;
const CHECK = 22;
const CHECK_INSET = 12;

const useStyles = makeStyles((t) => ({
  root: { gap: t.space[2] },
  row: { flexDirection: 'row', gap: t.space[2] },
  slot: { flex: 1 },
  tile: {
    flex: 1,
    height: TILE,
    borderRadius: t.radius.xl,
    backgroundColor: t.colors.recess,
  },
  lift: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: t.radius.xl,
    backgroundColor: t.colors.raised,
    boxShadow: t.shadow.lift,
  },
  clip: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: t.radius.xl,
    overflow: 'hidden',
  },
  plate: {
    position: 'absolute',
    right: PLATE_RIGHT,
    bottom: PLATE_BOTTOM,
    width: PLATE,
    height: PLATE,
    borderRadius: PLATE / 2,
    backgroundColor: t.colors.background,
  },
  photo: {
    position: 'absolute',
    right: PHOTO_RIGHT,
    bottom: PHOTO_BOTTOM,
    width: PHOTO,
    height: PHOTO,
    filter: PHOTO_SHADOW,
  },
  image: { width: '100%', height: '100%' },
  caption: {
    position: 'absolute',
    left: INSET_X,
    top: CAPTION_TOP,
    right: INSET_X,
    fontFamily: t.fontFamily,
    fontSize: t.typography.eyebrow.fontSize,
    lineHeight: t.typography.eyebrow.lineHeight,
    fontWeight: '400',
    color: t.colors.faint,
  },
  name: {
    position: 'absolute',
    left: INSET_X,
    top: NAME_TOP,
    width: NAME_WIDTH,
    fontFamily: t.fontFamily,
    fontSize: NAME_SIZE,
    lineHeight: NAME_LEADING,
    letterSpacing: NAME_TRACKING,
    fontWeight: '600',
    color: t.colors.title,
  },
  strong: { fontWeight: '700' },
  check: {
    position: 'absolute',
    left: CHECK_INSET,
    bottom: CHECK_INSET,
  },
}));

function Photo({
  uri,
  source,
}: {
  uri?: string | null;
  source?: ImageSourcePropType;
}) {
  const s = useStyles();
  const [failed, setFailed] = useState<string | null>(null);
  const image = uri && failed !== uri ? { uri } : source;
  if (!image) return null;
  return (
    <View pointerEvents="none" style={s.photo}>
      <Image
        source={image}
        style={s.image}
        resizeMode="contain"
        onError={() => uri && setFailed(uri)}
      />
    </View>
  );
}

function Tile<T extends string>({
  item,
  on,
  onPress,
}: {
  item: TileGridItem<T>;
  on: boolean;
  onPress: () => void;
}) {
  const t = useTheme();
  const s = useStyles();
  const pressed = useSharedValue(0);
  const rise = useSwitch(on, 'base', 'decelerate');
  const badge = useSwitch(on, 'spring', 'spring');
  const shrinkTo = t.press.scale;
  const face = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * (1 - shrinkTo) }],
  }));
  const lift = useAnimatedStyle(() => ({ opacity: rise.value }));
  const mark = useAnimatedStyle(() => ({
    opacity: Math.min(1, badge.value * 2),
    transform: [{ scale: badge.value }],
  }));
  const hold = (into: boolean) => () => {
    pressed.value = withTiming(into ? 1 : 0, timing(t, 'press'));
  };
  return (
    <PressableBase
      feedback="none"
      accessibilityRole="radio"
      accessibilityState={{ checked: on }}
      accessibilityLabel={item.label}
      onPress={onPress}
      onPressIn={hold(true)}
      onPressOut={hold(false)}
      style={s.slot}
    >
      <Animated.View style={[s.tile, face]}>
        <Animated.View pointerEvents="none" style={[s.lift, lift]} />
        <View pointerEvents="none" style={s.clip}>
          <View style={s.plate} />
          <Photo uri={item.uri} source={item.source} />
          {item.caption ? (
            <Text
              numberOfLines={1}
              maxFontSizeMultiplier={t.maxFontScale}
              style={s.caption}
            >
              {item.caption}
            </Text>
          ) : null}
          <Text
            numberOfLines={2}
            lineBreakStrategyIOS="hangul-word"
            maxFontSizeMultiplier={t.maxFontScale}
            style={[s.name, on && s.strong]}
          >
            {item.label}
          </Text>
          <Animated.View style={[s.check, mark]}>
            <CheckDisc size={CHECK} />
          </Animated.View>
        </View>
      </Animated.View>
    </PressableBase>
  );
}

export function TileGrid<T extends string>({
  items,
  value,
  onValueChange,
  style,
}: TileGridProps<T>) {
  const s = useStyles();
  const rows: TileGridItem<T>[][] = [];
  items.forEach((item, index) => {
    if (index % 2 === 0) rows.push([item]);
    else rows[rows.length - 1]!.push(item);
  });
  const press = (v: T) => {
    const next = nextSingle(value, v);
    if (!next) return;
    haptic('select');
    onValueChange(next);
  };
  return (
    <View accessibilityRole="radiogroup" style={[s.root, style]}>
      {rows.map((row) => (
        <View key={row[0]!.value} style={s.row}>
          {row.map((item) => (
            <Tile
              key={item.value}
              item={item}
              on={item.value === value}
              onPress={() => press(item.value)}
            />
          ))}
          {row.length === 1 ? <View style={s.slot} /> : null}
        </View>
      ))}
    </View>
  );
}
