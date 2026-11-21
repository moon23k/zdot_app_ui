import { useState } from 'react';
import {
  Image,
  type ImageSourcePropType,
  Text as RNText,
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
import { timing, useSwitch } from '../../internal/motion';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';
import { Text } from '../text/text';
import { haptic } from '../../internal/haptics';
import { nextMultiple, nextSingle } from '../../internal/selection';

export type CircleGridItem<T extends string> = {
  value: T;
  label: string;
  uri?: string | null;
  source?: ImageSourcePropType;
  glyph?: string;
};

type Single<T extends string> = {
  multiple?: false;
  value: T | null;
  onValueChange: (value: T) => void;
};

type Multiple<T extends string> = {
  multiple: true;
  value: readonly T[];
  onValueChange: (value: T[]) => void;
  max?: number;
};

export type CircleGridProps<T extends string> = (Single<T> | Multiple<T>) & {
  items: readonly CircleGridItem<T>[];
  columns?: number;
  style?: StyleProp<ViewStyle>;
};

const RING = 3;
const HALO = 4;
const RING_FROM = 1.12;
const BADGE = 24;
const BADGE_RING = 2.5;
const BADGE_SHIFT = (BADGE + BADGE_RING * 2 - 26) / 2;
const GLYPH = 40;

const useStyles = makeStyles((t) => ({
  root: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: t.space[5],
  },
  cell: {
    alignItems: 'center',
    gap: t.space[2],
    paddingHorizontal: t.space[1],
  },
  ring: {
    width: '100%',
    aspectRatio: 1,
    padding: RING,
    borderWidth: RING,
    borderRadius: t.radius.full,
    borderColor: 'transparent',
  },
  hoop: {
    position: 'absolute',
    top: RING - HALO,
    right: RING - HALO,
    bottom: RING - HALO,
    left: RING - HALO,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.raised,
    boxShadow: t.shadow.lift,
  },
  fill: { flex: 1 },
  circle: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: t.radius.full,
    backgroundColor: t.colors.muted,
  },
  image: { width: '100%', height: '100%' },
  glyph: { fontSize: GLYPH, lineHeight: GLYPH * 1.25 },
  badge: {
    position: 'absolute',
    right: -BADGE_SHIFT,
    bottom: -BADGE_SHIFT,
  },
  label: { textAlign: 'center' },
}));

function Circle({
  uri,
  source,
  glyph,
}: {
  uri?: string | null;
  source?: ImageSourcePropType;
  glyph?: string;
}) {
  const s = useStyles();
  const [failed, setFailed] = useState<string | null>(null);
  const image = uri && failed !== uri ? { uri } : source;
  return (
    <View style={s.circle}>
      {image ? (
        <Image
          source={image}
          style={s.image}
          resizeMode="cover"
          onError={() => uri && setFailed(uri)}
        />
      ) : glyph ? (
        <RNText style={s.glyph}>{glyph}</RNText>
      ) : null}
    </View>
  );
}

function Cell<T extends string>({
  item,
  on,
  multiple,
  width,
  onPress,
}: {
  item: CircleGridItem<T>;
  on: boolean;
  multiple: boolean;
  width: `${number}%`;
  onPress: () => void;
}) {
  const t = useTheme();
  const s = useStyles();
  const pressed = useSharedValue(0);
  const ring = useSwitch(on, 'base', 'decelerate');
  const badge = useSwitch(on, 'spring', 'spring');
  const shrinkTo = t.press.scale;
  const face = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * (1 - shrinkTo) }],
  }));
  const hoop = useAnimatedStyle(() => ({
    opacity: ring.value,
    transform: [{ scale: RING_FROM - (RING_FROM - 1) * ring.value }],
  }));
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
      accessibilityRole={multiple ? 'checkbox' : 'radio'}
      accessibilityState={{ checked: on }}
      accessibilityLabel={item.label}
      onPress={onPress}
      onPressIn={hold(true)}
      onPressOut={hold(false)}
      style={[s.cell, { width }]}
    >
      <View style={s.ring}>
        <Animated.View pointerEvents="none" style={[s.hoop, hoop]} />
        <Animated.View style={[s.fill, face]}>
          <Circle uri={item.uri} source={item.source} glyph={item.glyph} />
        </Animated.View>
        <Animated.View pointerEvents="none" style={[s.badge, mark]}>
          <CheckDisc size={BADGE} ring={BADGE_RING} />
        </Animated.View>
      </View>
      <Text
        variant="label"
        weight={on ? 'semibold' : 'regular'}
        style={s.label}
        numberOfLines={2}
      >
        {item.label}
      </Text>
    </PressableBase>
  );
}

export function CircleGrid<T extends string>(props: CircleGridProps<T>) {
  const { items, columns = 3, style } = props;
  const s = useStyles();
  const width = `${100 / columns}%` as const;
  const isOn = (v: T) =>
    props.multiple ? props.value.includes(v) : props.value === v;
  const press = (v: T) => {
    if (props.multiple) {
      const next = nextMultiple(props.value, v, props.max);
      if (next) props.onValueChange(next);
    } else {
      const next = nextSingle(props.value, v);
      if (next) props.onValueChange(next);
    }
  };
  return (
    <View
      accessibilityRole={props.multiple ? undefined : 'radiogroup'}
      style={[s.root, style]}
    >
      {items.map((item) => (
        <Cell
          key={item.value}
          item={item}
          on={isOn(item.value)}
          multiple={!!props.multiple}
          width={width}
          onPress={() => {
            haptic('select');
            press(item.value);
          }}
        />
      ))}
    </View>
  );
}
