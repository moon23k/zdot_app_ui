import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button } from '../../components/button/button';
import { CreditCost } from '../../components/credit/credit';
import { Text } from '../../components/text/text';
import { renderIcon, type IconSlot } from '../../internal/icon';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';
import { EdgeFade, hasMore } from './edge-fade';

export type PhotoToolItem = {
  key: string;
  icon: IconSlot;
  label: string;
  onPress: () => void;
  active?: boolean;
  disabled?: boolean;
  cost?: number | null;
};

export type PhotoToolBarProps = {
  items: readonly PhotoToolItem[];
  action: { label: string; onPress: () => void };
};

const useStyles = makeStyles((t) => ({
  bar: {
    height: t.space[16],
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: t.space[1],
    borderTopWidth: 1,
    borderTopColor: t.colors.border,
    backgroundColor: t.colors.surface,
  },
  tools: { flex: 1, alignSelf: 'stretch', justifyContent: 'center' },
  row: { alignItems: 'center' },
  item: {
    width: t.space[16],
    height: t.space[16],
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space[1],
    borderRadius: t.radius.md,
  },
  on: { backgroundColor: t.colors.muted },
  cost: { position: 'absolute', top: t.space[1], right: 0 },
}));

export function PhotoToolBar({ items, action }: PhotoToolBarProps) {
  const t = useTheme();
  const s = useStyles();
  const [view, setView] = useState(0);
  const [content, setContent] = useState(0);
  const [offset, setOffset] = useState(0);
  const more = hasMore(offset, view, content);
  const step = t.space[16];
  const over = view > 0 ? items.length * step - view : 0;
  const tail = over > 0 ? (step - (over % step)) % step : 0;
  return (
    <View accessibilityRole="toolbar" style={s.bar}>
      <View style={s.tools}>
        <ScrollView
          testID="photo-tools"
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[s.row, { paddingRight: tail }]}
          snapToInterval={over > 0 ? step : undefined}
          decelerationRate={over > 0 ? 'fast' : undefined}
          scrollEventThrottle={16}
          onLayout={(e) => setView(e.nativeEvent.layout.width)}
          onContentSizeChange={(w) => setContent(w)}
          onScroll={(e) => setOffset(e.nativeEvent.contentOffset.x)}
        >
          {items.map((item) => {
            const color = item.disabled
              ? t.colors.disabledForeground
              : t.colors.title;
            return (
              <PressableBase
                key={item.key}
                onPress={item.onPress}
                disabled={item.disabled}
                disabledStyle={{}}
                feedback="small"
                accessibilityLabel={item.label}
                accessibilityState={
                  item.active === undefined
                    ? undefined
                    : { selected: item.active }
                }
                style={[s.item, item.active && s.on]}
              >
                {renderIcon(item.icon, { color, size: t.space[6] })}
                <Text variant="caption" numberOfLines={1} style={{ color }}>
                  {item.label}
                </Text>
                {item.cost != null ? (
                  <View pointerEvents="none" style={s.cost}>
                    <CreditCost
                      value={item.cost}
                      tone={item.disabled ? 'disabled' : 'muted'}
                    />
                  </View>
                ) : null}
              </PressableBase>
            );
          })}
        </ScrollView>
        {more ? (
          <EdgeFade side="right" size={t.space[12]} color={t.colors.surface} />
        ) : null}
      </View>
      <Button variant="ghost" size="md" onPress={action.onPress}>
        {action.label}
      </Button>
    </View>
  );
}
