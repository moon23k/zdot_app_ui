import { StyleSheet, View } from 'react-native';

const OPEN = 'transparent';

const g = StyleSheet.create({
  arc: { position: 'absolute', transform: [{ rotate: '-55deg' }] },
  head: { position: 'absolute', transform: [{ rotate: '45deg' }] },
});

export function UndoGlyph({ color, size }: { color: string; size: number }) {
  const unit = size / 18;
  const stroke = Math.max(1.5, unit * 1.7);
  const ring = unit * 13;
  const head = unit * 4.8;
  return (
    <View style={{ width: size, height: size }}>
      <View
        style={[
          g.arc,
          {
            left: unit * 2.5,
            top: unit * 3,
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
            left: unit * 6.6,
            top: unit * 1.45,
            width: head,
            height: head,
            borderLeftWidth: stroke,
            borderBottomWidth: stroke,
            borderColor: color,
            borderRadius: unit * 0.5,
          },
        ]}
      />
    </View>
  );
}
