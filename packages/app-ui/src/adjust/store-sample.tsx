import { useEffect, useRef, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  Image,
  Platform,
  StyleSheet,
  Text as RNText,
  View,
  type ImageSourcePropType,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useReducedMotion } from '../internal/use-reduced-motion';

export type StoreSampleScene =
  'color' | 'motion' | 'shape' | 'style' | 'power' | 'whole';

export type StoreSampleLook = {
  surface: string;
  surfaceAlt: string;
  text: string;
  muted: string;
  accent: string;
  onAccent: string;
  radiusSm: number;
  radiusMd: number;
  radiusLg: number;
  button: 'square' | 'rounded' | 'pill';
  gutter: number;
  sectionGap: number;
  autoplay: boolean;
  photoRatio: number;
  tracking: number;
  scale: number;
  weight: 500 | 600 | 700;
  area: 0 | 1 | 2;
  serif: boolean;
};

export type StoreSampleCopy = {
  store: string;
  headline: string;
  hero: string;
  section: string;
  more: string;
  notice: string;
  add: string;
};

export type StoreSampleProps = {
  scene: StoreSampleScene;
  look: StoreSampleLook;
  photos: readonly ImageSourcePropType[];
  hero: ImageSourcePropType;
  copy: StoreSampleCopy;
  width: number;
  height: number;
  fontFamily?: string;
  serifFamily?: string;
  cutout?: boolean;
};

const BASE = 390;
const PAD = 20;
const BAR = 56;
const SMALL = 280;
const TURN = 3000;
const SLIDE = 600;

const styles = StyleSheet.create({
  root: { overflow: 'hidden' },
  row: { flexDirection: 'row' },
  center: { alignItems: 'center', justifyContent: 'center' },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lead: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingRight: 0,
  },
  fill: { flex: 1 },
  strong: { fontWeight: '600' },
  bold: { fontWeight: '700' },
  dots: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  faded: { opacity: 0.35 },
  clip: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  inset: { width: '76%', height: '76%' },
});

const serifDefault = Platform.select({
  ios: 'NanumMyeongjo',
  android: 'NanumMyeongjo',
  default: "'Nanum Myeongjo', 'Noto Serif KR', serif",
});

function Glyph({ d, size, color }: { d: string; size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d={d}
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const MENU = 'M4 8h16M4 16h16';
const BAG = 'M5 8h14l1 12H4zM9 8a3 3 0 016 0';
const HEART =
  'M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0112 7.2a4.2 4.2 0 017.5 2.6C19.5 15.4 12 20 12 20z';

function Shot({
  source,
  box,
  tone,
  cutout,
}: {
  source: ImageSourcePropType | undefined;
  box: ViewStyle;
  tone: string;
  cutout: boolean;
}) {
  if (!source) return <View style={[box, { backgroundColor: tone }]} />;
  return cutout ? (
    <View style={[styles.clip, box, { backgroundColor: tone }]}>
      <Image source={source} resizeMode="contain" style={styles.inset} />
    </View>
  ) : (
    <Image
      source={source}
      resizeMode="cover"
      style={[box as never, { backgroundColor: tone }]}
    />
  );
}

function Rail({
  photos,
  side,
  gap,
  pad,
  radius,
  tone,
  play,
  cutout,
}: {
  photos: readonly ImageSourcePropType[];
  side: number;
  gap: number;
  pad: number;
  radius: number;
  tone: string;
  play: boolean;
  cutout: boolean;
}) {
  const reduced = useReducedMotion();
  const x = useRef(new Animated.Value(0)).current;
  const running = play && !reduced;
  useEffect(() => {
    if (!running) {
      x.setValue(0);
      return undefined;
    }
    let at = 0;
    const timer = setInterval(() => {
      at = (at + 1) % 3;
      Animated.timing(x, {
        toValue: -at * (side + gap),
        duration: SLIDE,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    }, TURN);
    return () => clearInterval(timer);
  }, [running, side, gap, x]);
  return (
    <Animated.View
      style={[
        styles.row,
        { gap, paddingLeft: pad, transform: [{ translateX: x }] },
      ]}
    >
      {photos.map((photo, i) => (
        <Shot
          key={i}
          source={photo}
          box={{ width: side, height: side, borderRadius: radius }}
          tone={tone}
          cutout={cutout}
        />
      ))}
    </Animated.View>
  );
}

export function StoreSample({
  scene,
  look,
  photos,
  hero,
  copy,
  width,
  height,
  fontFamily,
  serifFamily = serifDefault,
  cutout = false,
}: StoreSampleProps) {
  const k = width / BASE;
  const px = (n: number) => n * k;
  const tall = height / k;
  const small = tall < SMALL;
  const inner = BASE - PAD * 2;
  const cell = (inner - look.gutter) / 2;
  const family = look.serif ? serifFamily : fontFamily;
  const round = (h: number) =>
    look.button === 'pill'
      ? h / 2
      : look.button === 'square'
        ? look.radiusSm
        : look.radiusMd;
  const title = (size: number): TextStyle => ({
    fontFamily: family,
    fontSize: px(size),
    lineHeight: px(size + 10),
    letterSpacing: px(size * look.tracking),
    fontWeight: String(look.weight) as TextStyle['fontWeight'],
    color: look.text,
  });
  const photo = (i: number, w: number, h: number, radius = look.radiusLg) => (
    <Shot
      key={i}
      source={photos[i % Math.max(1, photos.length)]}
      box={{ width: px(w), height: px(h), borderRadius: px(radius) }}
      tone={look.surfaceAlt}
      cutout={cutout}
    />
  );
  const pair = (first: number, h: number) => (
    <View
      style={[styles.row, { gap: px(look.gutter), paddingHorizontal: px(PAD) }]}
    >
      {photo(first, cell, h)}
      {photo(first + 1, cell, h)}
    </View>
  );
  const button = (label: string, h: number, size: number, flip = false) => (
    <View
      style={[
        styles.center,
        {
          height: px(h),
          paddingHorizontal: px(22),
          borderRadius: px(round(h)),
          backgroundColor: flip ? look.onAccent : look.accent,
        },
      ]}
    >
      <RNText
        allowFontScaling={false}
        style={[
          styles.strong,
          {
            fontFamily,
            fontSize: px(size),
            color: flip ? look.accent : look.onAccent,
          },
        ]}
      >
        {label}
      </RNText>
    </View>
  );
  const bar = (
    <View
      style={[styles.between, { height: px(BAR), paddingHorizontal: px(PAD) }]}
    >
      <Glyph d={MENU} size={px(22)} color={look.text} />
      <RNText allowFontScaling={false} style={[title(20), styles.bold]}>
        {copy.store}
      </RNText>
      <Glyph d={BAG} size={px(22)} color={look.text} />
    </View>
  );
  const strong = look.area === 2;
  const heroHeight =
    scene === 'whole'
      ? 252
      : Math.min(300, Math.max(130, tall - (small ? 44 : 58)));
  const heroBlock = (
    <View
      style={[
        styles.row,
        {
          height: px(heroHeight),
          backgroundColor: strong ? look.accent : look.surfaceAlt,
        },
      ]}
    >
      <View
        style={[
          styles.lead,
          {
            paddingVertical: px(small ? 14 : 20),
            paddingLeft: px(small ? 14 : 20),
          },
        ]}
      >
        <RNText
          allowFontScaling={false}
          style={[
            title(Math.round((small ? 12.6 : 16) * Math.pow(look.scale, 3.6))),
            strong && { color: look.onAccent },
          ]}
        >
          {copy.hero}
        </RNText>
        {button(copy.more, small ? 36 : 48, 15, strong)}
      </View>
      <Shot
        source={photos[2 % Math.max(1, photos.length)]}
        box={{ width: px(178), height: '100%' }}
        tone={strong ? look.accent : look.surfaceAlt}
        cutout={cutout}
      />
    </View>
  );
  const band = (
    <View
      style={[
        styles.center,
        {
          height: px(48),
          backgroundColor: look.area === 0 ? look.surface : look.accent,
        },
      ]}
    >
      <RNText
        allowFontScaling={false}
        style={[
          styles.strong,
          {
            fontFamily,
            fontSize: px(15),
            color: look.area === 0 ? look.muted : look.onAccent,
          },
        ]}
      >
        {copy.notice}
      </RNText>
    </View>
  );
  const sectionTitle = (
    <RNText
      allowFontScaling={false}
      style={[
        title(Math.round(16 * Math.pow(look.scale, 2))),
        { paddingHorizontal: px(PAD), paddingBottom: px(14) },
      ]}
    >
      {copy.section}
    </RNText>
  );

  let body: ReactNode;
  if (scene === 'color') {
    const h = Math.max(70, (tall - BAR - look.gutter - PAD) / 2);
    body = (
      <>
        {bar}
        <View style={{ gap: px(look.gutter) }}>
          {pair(0, h)}
          {pair(2, h)}
        </View>
      </>
    );
  } else if (scene === 'motion') {
    const side = Math.max(64, Math.min(230, tall * 0.42));
    body = (
      <View style={{ paddingTop: px(PAD), gap: px(look.sectionGap) }}>
        <View>
          <Rail
            photos={[0, 1, 3, 2].map(
              (i) => photos[i % Math.max(1, photos.length)]!
            )}
            side={px(side)}
            gap={px(look.gutter)}
            pad={px(PAD)}
            radius={px(look.radiusLg)}
            tone={look.surfaceAlt}
            play={look.autoplay}
            cutout={cutout}
          />
          {look.autoplay ? (
            <View style={[styles.dots, { bottom: -px(PAD), gap: px(6) }]}>
              {[0, 1, 2].map((i) => (
                <View
                  key={i}
                  style={[
                    {
                      width: px(i ? 6 : 18),
                      height: px(6),
                      borderRadius: px(3),
                      backgroundColor: i ? look.muted : look.accent,
                    },
                    i > 0 && styles.faded,
                  ]}
                />
              ))}
            </View>
          ) : null}
        </View>
        {pair(2, cell)}
      </View>
    );
  } else if (scene === 'shape') {
    const h = Math.max(70, tall - PAD * 3 - 56);
    body = (
      <View style={{ padding: px(PAD), gap: px(PAD) }}>
        <Shot
          source={hero}
          box={{
            width: px(inner),
            height: px(h),
            borderRadius: px(look.radiusLg),
          }}
          tone={look.surfaceAlt}
          cutout={cutout}
        />
        <View style={[styles.row, { gap: px(10) }]}>
          <View
            style={[
              styles.center,
              {
                width: px(56),
                height: px(56),
                borderRadius: px(round(56)),
                backgroundColor: look.surfaceAlt,
              },
            ]}
          >
            <Glyph d={HEART} size={px(24)} color={look.text} />
          </View>
          <View style={styles.fill}>{button(copy.add, 56, 17)}</View>
        </View>
      </View>
    );
  } else if (scene === 'style') {
    const w = Math.min(260, Math.max(90, (tall - 110) / 1.25));
    body = (
      <View style={{ paddingTop: px(22) }}>
        <RNText
          allowFontScaling={false}
          numberOfLines={1}
          style={[title(small ? 26 : 30), { paddingHorizontal: px(PAD) }]}
        >
          {copy.headline}
        </RNText>
        <View
          style={[
            styles.row,
            {
              gap: px(look.gutter),
              paddingLeft: px(PAD),
              paddingTop: px(16),
            },
          ]}
        >
          {[1, 0, 3].map((i) =>
            photo(i, w, w / look.photoRatio, Math.min(look.radiusLg, w / 4))
          )}
        </View>
      </View>
    );
  } else if (scene === 'power') {
    body = (
      <>
        {heroBlock}
        {band}
        <View style={{ paddingTop: px(22) }}>{sectionTitle}</View>
        {pair(0, cell)}
      </>
    );
  } else {
    body = (
      <>
        {bar}
        {heroBlock}
        {band}
        <View style={{ paddingTop: px(look.sectionGap) }}>
          {sectionTitle}
          {pair(1, cell / look.photoRatio)}
        </View>
      </>
    );
  }
  return (
    <View
      pointerEvents="none"
      style={[styles.root, { width, height, backgroundColor: look.surface }]}
    >
      {body}
    </View>
  );
}
