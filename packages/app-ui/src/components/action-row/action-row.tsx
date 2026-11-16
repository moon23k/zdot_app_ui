import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { makeStyles } from '../../utils/styles';

export type ActionRowProps = {
  children: ReactNode;
  align?: 'start' | 'end' | 'between';
  style?: StyleProp<ViewStyle>;
};

const useStyles = makeStyles((t) => ({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: t.space[2],
  },
  start: { justifyContent: 'flex-start' },
  end: { justifyContent: 'flex-end' },
  between: { justifyContent: 'space-between' },
}));

export function ActionRow({ children, align = 'end', style }: ActionRowProps) {
  const s = useStyles();
  return <View style={[s.root, s[align], style]}>{children}</View>;
}
