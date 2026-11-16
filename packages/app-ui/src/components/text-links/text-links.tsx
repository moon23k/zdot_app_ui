import { Fragment } from 'react';
import { View } from 'react-native';
import { PressableBase } from '../../internal/pressable-base';
import { makeStyles } from '../../utils/styles';
import { Text } from '../text/text';

export type TextLink = { label: string; onPress: () => void };

export type TextLinksProps = { items: readonly TextLink[] };

const UNDER = 1;

const useStyles = makeStyles((t) => ({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space[3],
    paddingVertical: t.space[6],
  },
  bar: { width: 1, height: t.space[3], backgroundColor: t.colors.border },
  link: { paddingVertical: t.space[1] },
  under: {
    paddingBottom: UNDER,
    borderBottomWidth: 1,
    borderBottomColor: t.colors.input,
  },
}));

export function TextLinks({ items }: TextLinksProps) {
  const s = useStyles();
  return (
    <View style={s.root}>
      {items.map((item, index) => (
        <Fragment key={item.label}>
          {index ? <View style={s.bar} /> : null}
          <PressableBase
            style={s.link}
            accessibilityRole="button"
            onPress={item.onPress}
          >
            <View style={s.under}>
              <Text variant="label" tone="muted">
                {item.label}
              </Text>
            </View>
          </PressableBase>
        </Fragment>
      ))}
    </View>
  );
}
