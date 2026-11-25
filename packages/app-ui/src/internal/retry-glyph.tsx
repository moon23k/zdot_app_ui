import { StyleSheet, View } from 'react-native';

const OPEN = 'transparent';

const g = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  open: { transform: [{ rotate: '45deg' }] },
  head: { position: 'absolute' },
});

export function RetryGlyph({ color, size }: { color: string; size: number }) {
  const stroke = Math.max(2, size / 11);
  const ring = size * 0.76;
  return (
    <View style={[g.center, { width: size, height: size }]}>
      <View
        style={[
          g.open,
          {
            width: ring,
            height: ring,
            borderRadius: ring / 2,
            borderWidth: stroke,
            borderTopColor: OPEN,
            borderRightColor: color,
            borderBottomColor: color,
            borderLeftColor: color,
          },
        ]}
      />
      <View
        style={[
          g.head,
          {
            top: size * 0.08,
            right: size * 0.1,
            width: size * 0.3,
            height: size * 0.3,
            borderTopWidth: stroke,
            borderRightWidth: stroke,
            borderColor: color,
          },
        ]}
      />
    </View>
  );
}
