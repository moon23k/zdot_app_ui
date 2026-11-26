import { useState } from 'react';
import {
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Button, type ButtonProps } from '../../components/button/button';
import { Photo } from '../../components/photo/photo';
import { Text } from '../../components/text/text';
import { ImageGlyph, PlusGlyph } from '../../internal/glyphs';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { withAlpha } from '../../utils/color';
import { makeStyles } from '../../utils/styles';

export type PhotoMosaicProps = {
  images: readonly string[];
  onPress?: () => void;
  accessibilityLabel?: string;
};

export type FactRow = { label: string; value: string };

export type FactRowsProps = {
  rows: readonly FactRow[];
};

export type AddThumbsProps = {
  images: readonly string[];
  onAdd: () => void;
  addLabel: string;
};

export type TintButtonProps = Omit<ButtonProps, 'variant' | 'point' | 'pill'>;

const SCRIM = 0.45;

const useStyles = makeStyles((t) => ({
  mosaic: { flexDirection: 'row', gap: t.space[2] },
  side: { gap: t.space[2] },
  more: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: t.radius.md,
    backgroundColor: withAlpha(t.colors.foreground, SCRIM),
  },
  moreLabel: { color: t.colors.surface },
  facts: { borderTopWidth: 1, borderTopColor: t.colors.line },
  fact: {
    flexDirection: 'row',
    gap: t.space[4],
    paddingVertical: t.space[3],
    borderBottomWidth: 1,
    borderBottomColor: t.colors.line,
  },
  factLabel: { width: t.space[16] },
  factValue: { flex: 1 },
  thumbs: { flexDirection: 'row', flexWrap: 'wrap', gap: t.space[2] },
  add: {
    width: t.space[16],
    height: t.space[16],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: t.radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: t.colors.input,
  },
  thumb: { width: t.space[16] },
  tint: {
    paddingHorizontal: t.space[4],
    backgroundColor: t.colors.primaryTint,
  },
}));

function Cell({ uri, style }: { uri?: string; style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  return (
    <Photo
      source={{ uri: uri ?? '' }}
      radius={t.radius.md}
      fallback={
        <ImageGlyph color={t.colors.mutedForeground} size={t.iconSize.md} />
      }
      style={style}
    />
  );
}

export function PhotoMosaic({
  images,
  onPress,
  accessibilityLabel = '사진',
}: PhotoMosaicProps) {
  const t = useTheme();
  const s = useStyles();
  const [width, setWidth] = useState(0);
  const gap = t.space[2];
  const small = Math.max(0, (width - gap * 2) / 3);
  const big = small * 2 + gap;
  const extra = images.length - 3;
  return (
    <View
      onLayout={(event: LayoutChangeEvent) =>
        setWidth(event.nativeEvent.layout.width)
      }
    >
      {width > 0 ? (
        <PressableBase
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          onPress={onPress}
          feedback="small"
          style={s.mosaic}
        >
          <Cell uri={images[0]} style={{ width: big }} />
          <View style={[s.side, { width: small }]}>
            <Cell uri={images[1]} />
            <View>
              <Cell uri={images[2]} />
              {extra > 0 ? (
                <View pointerEvents="none" style={s.more}>
                  <Text variant="label" weight="semibold" style={s.moreLabel}>
                    {`+${extra}`}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </PressableBase>
      ) : null}
    </View>
  );
}

export function FactRows({ rows }: FactRowsProps) {
  const s = useStyles();
  if (!rows.length) return null;
  return (
    <View style={s.facts}>
      {rows.map((row, index) => (
        <View key={`${row.label}-${index}`} style={s.fact}>
          <Text
            variant="label"
            tone="muted"
            numberOfLines={1}
            style={s.factLabel}
          >
            {row.label}
          </Text>
          <Text variant="label" numberOfLines={2} style={s.factValue}>
            {row.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function AddThumbs({ images, onAdd, addLabel }: AddThumbsProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View style={s.thumbs}>
      <PressableBase
        accessibilityRole="button"
        accessibilityLabel={addLabel}
        onPress={onAdd}
        feedback="small"
        style={s.add}
      >
        <PlusGlyph color={t.colors.mutedForeground} size={t.iconSize.md} />
      </PressableBase>
      {images.map((uri, index) => (
        <PressableBase
          key={`${uri}-${index}`}
          accessibilityRole="imagebutton"
          accessibilityLabel={`${addLabel} ${index + 1}`}
          onPress={onAdd}
          feedback="small"
        >
          <Photo source={{ uri }} radius={t.radius.md} style={s.thumb} />
        </PressableBase>
      ))}
    </View>
  );
}

export function TintButton({ style, ...rest }: TintButtonProps) {
  const s = useStyles();
  return <Button {...rest} variant="secondary" point style={[s.tint, style]} />;
}
