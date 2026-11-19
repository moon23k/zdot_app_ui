import { View } from 'react-native';
import { Text } from '../../components/text/text';
import { CheckGlyph } from '../../internal/glyphs';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { pickForeground } from '../../utils/color';
import { makeStyles } from '../../utils/styles';

export type ColorBand = {
  key: string;
  color: string;
  name: string;
  caption: string;
};

export type ColorBandListProps = {
  items: readonly ColorBand[];
  value: string | null;
  onValueChange: (key: string) => void;
};

const BAND = 76;
const MARK = 24;
const CHECK = 14;
const WHITE = '#FFFFFF';

const useStyles = makeStyles((t) => ({
  list: { overflow: 'hidden', borderRadius: t.radius.lg },
  band: {
    height: BAND,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: t.space[3],
    paddingVertical: t.space[3],
    paddingHorizontal: t.space[4],
  },
  names: { flexShrink: 1, minWidth: 0 },
  mark: {
    alignSelf: 'center',
    width: MARK,
    height: MARK,
    borderRadius: t.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WHITE,
  },
}));

export function ColorBandList({
  items,
  value,
  onValueChange,
}: ColorBandListProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View accessibilityRole="radiogroup" style={s.list}>
      {items.map((item) => {
        const selected = item.key === value;
        const ink = {
          color: pickForeground(item.color, t.colors.foreground, WHITE),
        };
        return (
          <PressableBase
            key={item.key}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={`${item.name}, ${item.caption}`}
            feedback="row"
            onPress={() => onValueChange(item.key)}
            style={[s.band, { backgroundColor: item.color }]}
          >
            <View style={s.names}>
              <Text
                variant="body"
                weight="semibold"
                numberOfLines={1}
                style={ink}
              >
                {item.name}
              </Text>
              <Text variant="caption" numberOfLines={1} style={ink}>
                {item.caption}
              </Text>
            </View>
            {selected ? (
              <View style={s.mark}>
                <CheckGlyph color={item.color} size={CHECK} />
              </View>
            ) : null}
          </PressableBase>
        );
      })}
    </View>
  );
}
