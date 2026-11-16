import type { ReactNode } from 'react';
import { Modal, View, type StyleProp, type ViewStyle } from 'react-native';
import { Button } from '../../components/button/button';
import { Text } from '../../components/text/text';
import { CloseGlyph } from '../../internal/glyphs';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type ScanModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  topInset?: number;
  bottomInset?: number;
  progress?: string;
  notice?: string;
  manualLabel?: string;
  onManual?: () => void;
  children: (frame: { style: StyleProp<ViewStyle> }) => ReactNode;
};

const useStyles = makeStyles((t) => ({
  root: { flex: 1, backgroundColor: t.colors.background },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: t.layout.screenX,
    paddingVertical: t.space[3],
  },
  title: { flexDirection: 'row', alignItems: 'baseline', gap: t.space[2] },
  frame: { flex: 1 },
  foot: {
    gap: t.space[2],
    paddingHorizontal: t.layout.screenX,
    paddingTop: t.space[3],
  },
}));

export function ScanModal({
  open,
  onClose,
  title,
  topInset = 0,
  bottomInset = 0,
  progress,
  notice,
  manualLabel = '직접 입력',
  onManual,
  children,
}: ScanModalProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <Modal visible={open} animationType="slide" onRequestClose={onClose}>
      <View
        style={[s.root, { paddingTop: topInset, paddingBottom: bottomInset }]}
      >
        <View style={s.head}>
          <View style={s.title}>
            <Text variant="title" weight="bold" accessibilityRole="header">
              {title}
            </Text>
            {progress ? (
              <Text variant="label" tone="muted">
                {progress}
              </Text>
            ) : null}
          </View>
          <PressableBase
            accessibilityRole="button"
            accessibilityLabel="닫기"
            touchHeight={t.iconSize.md}
            hitSlop={(t.minTouchSize - t.iconSize.md) / 2}
            onPress={onClose}
          >
            <CloseGlyph color={t.colors.foreground} size={t.iconSize.md} />
          </PressableBase>
        </View>
        {children({ style: s.frame })}
        {notice || onManual ? (
          <View style={s.foot}>
            {notice ? (
              <Text
                variant="label"
                tone="danger"
                accessibilityLiveRegion="polite"
              >
                {notice}
              </Text>
            ) : null}
            {onManual ? (
              <Button variant="secondary" onPress={onManual}>
                {manualLabel}
              </Button>
            ) : null}
          </View>
        ) : null}
      </View>
    </Modal>
  );
}
