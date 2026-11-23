import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { CopyGlyph, EyeOffGlyph, TrashGlyph } from '../../internal/glyphs';
import { makeStyles } from '../../utils/styles';
import { DropdownMenu } from './dropdown-menu';

const useStyles = makeStyles((t) => ({
  root: { width: 390, height: 520, backgroundColor: t.colors.background },
}));

function Demo() {
  const s = useStyles();
  const [open, setOpen] = useState(true);
  return (
    <View style={s.root}>
      <DropdownMenu
        open={open}
        onOpenChange={setOpen}
        anchor={{ x: 322, y: 318, width: 44, height: 44 }}
        items={[
          {
            key: 'hide',
            icon: EyeOffGlyph,
            label: '숨기기',
            onPress: () => {},
          },
          { key: 'copy', icon: CopyGlyph, label: '복제', onPress: () => {} },
          {
            key: 'remove',
            icon: TrashGlyph,
            label: '삭제',
            tone: 'danger',
            separated: true,
            onPress: () => {},
          },
        ]}
      />
    </View>
  );
}

const meta = {
  title: 'Components/DropdownMenu',
  component: Demo,
} satisfies Meta<typeof Demo>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
