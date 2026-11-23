import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Column, Section } from '../../__stories__/helpers';
import { makeStyles } from '../../utils/styles';
import { Button } from '../button/button';
import { CreditCost, CreditPill } from './credit';

const useStyles = makeStyles((t) => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: t.space[2] },
}));

function Demo() {
  const s = useStyles();
  return (
    <Column>
      <Section title="잔량 · 단추">
        <View style={s.row}>
          <CreditPill balance={127} />
          <CreditCost value={1} />
          <Button variant="secondary" cost={1} onPress={() => {}}>
            다시 만들기
          </Button>
        </View>
      </Section>
    </Column>
  );
}

const meta = {
  title: 'Components/Credit',
  component: Demo,
} satisfies Meta<typeof Demo>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
