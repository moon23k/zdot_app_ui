import { StyleSheet, View } from 'react-native';

const g = StyleSheet.create({
  arc: {
    position: 'absolute',
    borderTopColor: 'transparent',
    transform: [{ rotate: '-45deg' }],
  },
  head: { position: 'absolute', transform: [{ rotate: '-6deg' }] },
});

export function UndoGlyph({ color, size }: { color: string; size: number }) {
  const unit = size / 18;
  const stroke = Math.max(1.5, unit * 1.7);
  const ring = unit * 13;
  const head = unit * 5;
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
            borderColor: color,
          },
        ]}
      />
      <View
        style={[
          g.head,
          {
            left: unit * 1.6,
            top: unit * 1.2,
            width: head,
            height: head,
            borderLeftWidth: stroke,
            borderBottomWidth: stroke,
            borderColor: color,
            borderRadius: unit * 0.8,
          },
        ]}
      />
    </View>
  );
}
