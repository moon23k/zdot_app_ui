import { View } from 'react-native';
import { CreditCost } from '../../components/credit/credit';
import { KeyboardGlyph } from '../../internal/glyphs';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';
import { ActionChips } from './action-chips';

export type RewriteTrayProps<T extends string> = {
  items: readonly { value: T; label: string }[];
  onPick: (value: T) => void;
  onKeyboard: () => void;
  cost?: number | null;
  disabled?: boolean;
  keyboardLabel?: string;
};

const SEP = 20;

const useStyles = makeStyles((t) => ({
  row: {
    height: t.space[12] + t.space[2],
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: t.space[2],
  },
  key: {
    width: t.minTouchSize,
    height: t.minTouchSize,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: t.radius.md,
  },
  sep: {
    width: 1,
    height: SEP,
    marginLeft: t.space[1],
    marginRight: t.space[2],
    backgroundColor: t.colors.border,
  },
  cost: { marginRight: t.space[2] },
  chips: { flex: 1, overflow: 'hidden' },
  track: { paddingRight: t.space[4] },
}));

export function RewriteTray<T extends string>({
  items,
  onPick,
  onKeyboard,
  cost,
  disabled,
  keyboardLabel = '직접 고치기',
}: RewriteTrayProps<T>) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View style={s.row}>
      <PressableBase
        onPress={onKeyboard}
        accessibilityLabel={keyboardLabel}
        style={s.key}
      >
        <KeyboardGlyph color={t.colors.title} size={t.space[6]} />
      </PressableBase>
      <View style={s.sep} />
      {cost != null ? (
        <View style={s.cost}>
          <CreditCost value={cost} />
        </View>
      ) : null}
      <View style={s.chips}>
        <ActionChips
          items={items}
          onPick={onPick}
          disabled={disabled}
          inset={s.track}
        />
      </View>
    </View>
  );
}
