import { View } from 'react-native';
import { Button } from '../../components/button/button';
import { makeStyles } from '../../utils/styles';

export type ConfirmAction = {
  label: string;
  onPress: () => void;
  cost?: number | null;
  disabled?: boolean;
  loading?: boolean;
};

export type ConfirmRowProps = {
  secondary?: ConfirmAction;
  primary: ConfirmAction;
};

const useStyles = makeStyles((t) => ({
  row: {
    flexDirection: 'row',
    gap: t.space[2],
    paddingTop: t.space[5],
    paddingHorizontal: t.space[4],
  },
  item: { flex: 1 },
  off: { backgroundColor: t.colors.muted },
}));

export function ConfirmRow({ secondary, primary }: ConfirmRowProps) {
  const s = useStyles();
  const button = (action: ConfirmAction, variant: 'primary' | 'secondary') => (
    <Button
      variant={variant}
      size="md"
      pill
      cost={action.cost}
      disabled={action.disabled}
      loading={action.loading}
      onPress={action.onPress}
      style={[
        s.item,
        variant === 'primary' && action.disabled && !action.loading && s.off,
      ]}
    >
      {action.label}
    </Button>
  );
  return (
    <View style={s.row}>
      {secondary ? button(secondary, 'secondary') : null}
      {button(primary, 'primary')}
    </View>
  );
}
