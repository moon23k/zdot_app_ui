import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { makeStyles } from '../utils/styles';

export type SelectionTemplateProps = {
  bar: ReactNode;
  bottomInset?: number;
  children: ReactNode;
};

const useStyles = makeStyles((t) => ({
  root: { flex: 1, backgroundColor: t.colors.background },
  bar: { backgroundColor: t.colors.surface },
}));

export function SelectionTemplate({
  bar,
  bottomInset = 0,
  children,
}: SelectionTemplateProps) {
  const s = useStyles();
  return (
    <View style={s.root}>
      <ScrollView>{children}</ScrollView>
      <View style={[s.bar, { paddingBottom: bottomInset }]}>{bar}</View>
    </View>
  );
}
