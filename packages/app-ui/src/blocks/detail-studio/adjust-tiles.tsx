import { Text as RNText, View } from 'react-native';
import { CreditCost } from '../../components/credit/credit';
import { renderIcon, type IconSlot } from '../../internal/icon';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type AdjustTile<T extends string> = {
  value: T;
  icon: IconSlot;
  label: string;
};

export type AdjustTilesProps<T extends string> = {
  items: readonly AdjustTile<T>[];
  onPick: (value: T) => void;
  cost?: number | null;
  disabled?: boolean;
};

const useStyles = makeStyles((t) => ({
  row: {
    flexDirection: 'row',
    gap: t.space[2],
    paddingTop: t.space[1],
    paddingHorizontal: t.space[4],
  },
  tile: { flex: 1, alignItems: 'center', gap: t.space[2] },
  box: {
    alignSelf: 'stretch',
    height: t.space[16] + t.space[2],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: t.radius.md * 2,
    backgroundColor: t.colors.background,
  },
  cost: { position: 'absolute', top: t.space[2], right: t.space[2] },
  label: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.eyebrow.fontSize,
    letterSpacing: t.typography.eyebrow.letterSpacing,
    lineHeight: t.typography.eyebrow.lineHeight,
    fontWeight: t.typography.body.fontWeight,
    color: t.colors.title,
  },
}));

export function AdjustTiles<T extends string>({
  items,
  onPick,
  cost,
  disabled,
}: AdjustTilesProps<T>) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View style={s.row}>
      {items.map((item) => (
        <PressableBase
          key={item.value}
          onPress={() => onPick(item.value)}
          disabled={disabled}
          feedback="small"
          accessibilityLabel={item.label}
          style={s.tile}
        >
          <View style={s.box}>
            {renderIcon(item.icon, {
              color: t.colors.title,
              size: t.space[6],
            })}
            {cost != null ? (
              <View pointerEvents="none" style={s.cost}>
                <CreditCost value={cost} />
              </View>
            ) : null}
          </View>
          <RNText
            numberOfLines={1}
            maxFontSizeMultiplier={t.maxFontScale}
            style={s.label}
          >
            {item.label}
          </RNText>
        </PressableBase>
      ))}
    </View>
  );
}
