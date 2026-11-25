import { StyleSheet, View } from 'react-native';
import { MoreGlyph } from '../../internal/glyphs';
import type { IconRenderProps } from '../../internal/icon';

export { RetryGlyph } from '../../internal/retry-glyph';

const OPEN = 'transparent';

const g = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  arc: { position: 'absolute', transform: [{ rotate: '45deg' }] },
  turn: { transform: [{ rotate: '90deg' }] },
});

export function MinusGlyph({ color, size }: IconRenderProps) {
  const stroke = Math.max(1.5, size / 16);
  return (
    <View style={[g.center, { width: size, height: size }]}>
      <View
        style={{
          width: size * 0.6,
          height: stroke,
          borderRadius: stroke,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

export function WaveGlyph({ color, size }: IconRenderProps) {
  const stroke = Math.max(1.5, size / 14);
  const ring = size * 0.4;
  const top = (size - ring) / 2;
  const arc = {
    width: ring,
    height: ring,
    top,
    borderRadius: ring / 2,
    borderWidth: stroke,
    borderColor: OPEN,
  };
  return (
    <View style={{ width: size, height: size }}>
      <View
        style={[
          g.arc,
          arc,
          {
            left: size / 2 - ring + stroke / 2,
            borderTopColor: color,
            borderLeftColor: color,
          },
        ]}
      />
      <View
        style={[
          g.arc,
          arc,
          {
            left: size / 2 - stroke / 2,
            borderBottomColor: color,
            borderRightColor: color,
          },
        ]}
      />
    </View>
  );
}

export function DotsGlyph({ color, size }: IconRenderProps) {
  return (
    <View style={g.turn}>
      <MoreGlyph color={color} size={size} />
    </View>
  );
}
