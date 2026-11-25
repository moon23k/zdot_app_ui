import { View } from 'react-native';
import { CreditCost } from '../../components/credit/credit';
import type { IconSlot } from '../../internal/icon';
import { makeStyles } from '../../utils/styles';
import { StudioTools } from './studio-tools';

export type RewriteTrayProps<T extends string> = {
  items: readonly { value: T; label: string; icon: IconSlot }[];
  onPick: (value: T) => void;
  cost?: number | null;
  disabled?: boolean;
};

const useStyles = makeStyles((t) => ({
  root: { gap: t.space[2], paddingTop: t.space[1] },
  cost: { alignItems: 'center' },
}));

export function RewriteTray<T extends string>({
  items,
  onPick,
  cost,
  disabled,
}: RewriteTrayProps<T>) {
  const s = useStyles();
  return (
    <View style={s.root}>
      {cost != null ? (
        <View style={s.cost}>
          <CreditCost value={cost} />
        </View>
      ) : null}
      <StudioTools
        docked={false}
        items={items.map((item) => ({
          key: item.value,
          icon: item.icon,
          label: item.label,
          disabled,
          onPress: () => onPick(item.value),
        }))}
      />
    </View>
  );
}
