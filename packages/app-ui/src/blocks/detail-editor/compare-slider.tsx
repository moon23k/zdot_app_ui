import { useRef, useState } from 'react';
import {
  Image,
  PanResponder,
  Text as RNText,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
} from 'react-native';
import { ChevronGlyph } from '../../internal/glyphs';
import { useTheme } from '../../theme/theme-provider';
import { withAlpha } from '../../utils/color';
import { makeStyles } from '../../utils/styles';

export type CompareSliderProps = {
  before: string;
  after: string;
  aspectRatio?: number;
  label?: string;
  labels?: { before: string; after: string };
};

const STEP = 0.1;
const TAG = 0.9;

const useStyles = makeStyles((t) => ({
  root: { width: '100%', overflow: 'hidden', backgroundColor: t.colors.muted },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0 },
  clip: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  line: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: t.colors.surface,
  },
  knob: {
    position: 'absolute',
    top: '50%',
    marginTop: -(t.space[8] + t.space[1]) / 2,
    width: t.space[8] + t.space[1],
    height: t.space[8] + t.space[1],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: t.radius.full,
    backgroundColor: t.colors.surface,
    boxShadow: t.shadow.md,
  },
  flip: { transform: [{ scaleX: -1 }] },
  tag: {
    position: 'absolute',
    top: t.space[4],
    height: t.space[6],
    justifyContent: 'center',
    paddingHorizontal: t.space[2],
    borderRadius: t.radius.full,
    backgroundColor: withAlpha(t.colors.surface, TAG),
  },
  tagStart: { left: t.space[4] },
  tagEnd: { right: t.space[4] },
  tagText: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.caption.fontSize,
    lineHeight: t.typography.caption.lineHeight,
    fontWeight: '600',
    color: t.colors.title,
  },
}));

export function CompareSlider({
  before,
  after,
  aspectRatio = 4 / 5,
  label = '원본과 비교',
  labels,
}: CompareSliderProps) {
  const t = useTheme();
  const s = useStyles();
  const knob = t.space[8] + t.space[1];
  const [width, setWidth] = useState(0);
  const [split, setSplit] = useState(0.5);
  const widthRef = useRef(0);
  const follow = (e: GestureResponderEvent) =>
    setSplit(
      Math.min(
        1,
        Math.max(0, e.nativeEvent.locationX / (widthRef.current || 1))
      )
    );
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: follow,
      onPanResponderMove: follow,
    })
  ).current;
  const layout = (e: LayoutChangeEvent) => {
    widthRef.current = e.nativeEvent.layout.width;
    setWidth(e.nativeEvent.layout.width);
  };
  const x = width * split;
  return (
    <View
      onLayout={layout}
      accessible
      accessibilityLabel={label}
      accessibilityRole="adjustable"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(split * 100) }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => {
        const step = e.nativeEvent.actionName === 'increment' ? STEP : -STEP;
        setSplit((now) => Math.min(1, Math.max(0, now + step)));
      }}
      style={[s.root, { aspectRatio }]}
      {...pan.panHandlers}
    >
      <Image
        source={{ uri: after }}
        resizeMode="cover"
        style={[s.fill, { width }]}
      />
      <View style={[s.clip, { width: x }]}>
        <Image
          source={{ uri: before }}
          resizeMode="cover"
          style={[s.fill, { width }]}
        />
      </View>
      <View style={[s.line, { left: x - 1 }]} />
      <View style={[s.knob, { left: x - knob / 2 }]}>
        <View style={s.flip}>
          <ChevronGlyph color={t.colors.title} size={t.space[3]} />
        </View>
        <ChevronGlyph color={t.colors.title} size={t.space[3]} />
      </View>
      {labels ? (
        <>
          <View pointerEvents="none" style={[s.tag, s.tagStart]}>
            <RNText maxFontSizeMultiplier={t.maxFontScale} style={s.tagText}>
              {labels.before}
            </RNText>
          </View>
          <View pointerEvents="none" style={[s.tag, s.tagEnd]}>
            <RNText maxFontSizeMultiplier={t.maxFontScale} style={s.tagText}>
              {labels.after}
            </RNText>
          </View>
        </>
      ) : null}
    </View>
  );
}
