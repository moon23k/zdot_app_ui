import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { makeStyles } from '../../utils/styles';

export type CardBlockProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const useStyles = makeStyles((t) => ({
  root: {
    paddingHorizontal: t.layout.screenX,
    paddingVertical: t.space[4],
    gap: t.space[3],
  },
}));

export function CardBlock({ children, style }: CardBlockProps) {
  const s = useStyles();
  return <View style={[s.root, style]}>{children}</View>;
}
