import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { CheckGlyph } from '../../internal/glyphs';
import {
  Backdrop,
  useNativeDriver,
  OverlayShown,
  useOverlayTransition,
} from '../../internal/overlay';
import { SheetHead } from '../../internal/sheet-head';
import { ListRow } from '../list-row/list-row';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';
import { ToastHost } from '../toast/toast';

export type SheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  bottomInset?: number;
  dismissible?: boolean;
  closeLabel?: string;
  compact?: boolean;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const DRAG_START = 4;
const DRAG_CLOSE = 80;
const FLING = 0.5;

const useStyles = makeStyles((t) => ({
  root: { flex: 1, justifyContent: 'flex-end' },
  options: { marginHorizontal: -t.space[4] },
  panel: {
    maxHeight: '90%',
    paddingTop: t.space[2],
    paddingHorizontal: t.space[4],
    gap: t.space[3],
    borderTopLeftRadius: t.radius.lg,
    borderTopRightRadius: t.radius.lg,
    backgroundColor: t.colors.surface,
    boxShadow: t.shadow.md,
  },
  grip: { gap: t.space[3] },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.border,
  },
  title: {
    ...t.typography.title,
    fontFamily: t.fontFamily,
    color: t.colors.title,
  },
  compact: { marginHorizontal: -t.space[4] },
}));

export function Sheet({
  open,
  onOpenChange,
  title,
  bottomInset = 0,
  dismissible = true,
  closeLabel = '닫기',
  compact = false,
  children,
  style,
}: SheetProps) {
  const t = useTheme();
  const s = useStyles();
  const { height } = useWindowDimensions();
  const { mounted, progress, shown } = useOverlayTransition(open);
  const [showing, setShowing] = useState(false);
  const [visible, setVisible] = useState(false);
  if (!mounted && (visible || showing)) {
    setShowing(false);
    setVisible(false);
  }
  useEffect(() => {
    if (!showing) return;
    const id = setTimeout(() => setVisible(true), t.motion.duration.long);
    return () => clearTimeout(id);
  }, [showing, t]);
  const drag = useRef(new Animated.Value(0)).current;

  const close = () => {
    if (dismissible) onOpenChange(false);
  };

  const settle = () =>
    Animated.timing(drag, {
      toValue: 0,
      duration: t.motion.duration.base,
      useNativeDriver,
    }).start();

  const grip = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > DRAG_START,
      onPanResponderMove: (_, g) => drag.setValue(Math.max(0, g.dy)),
      onPanResponderRelease: (_, g) => {
        if (g.dy > DRAG_CLOSE || g.vy > FLING) {
          gripClose.current();
          return;
        }
        settle();
      },
      onPanResponderTerminate: () => settle(),
    })
  ).current;
  const gripClose = useRef(() => {});
  gripClose.current = () => {
    if (!dismissible) {
      settle();
      return;
    }
    onOpenChange(false);
  };
  if (!open && !mounted) drag.setValue(0);

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={close}
      onShow={() => setShowing(true)}
    >
      <KeyboardAvoidingView behavior="padding" style={s.root}>
        <Backdrop progress={progress} onPress={close} label={closeLabel} />
        <Animated.View
          accessibilityViewIsModal
          style={[
            s.panel,
            { paddingBottom: t.space[4] + bottomInset },
            {
              transform: [
                {
                  translateY: Animated.add(
                    progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [height, 0],
                    }),
                    drag
                  ),
                },
              ],
            },
            style,
          ]}
        >
          <View style={s.grip} {...grip.panHandlers}>
            {compact && title ? (
              <View style={s.compact}>
                <SheetHead
                  title={title}
                  closeLabel={closeLabel}
                  onClose={() => onOpenChange(false)}
                />
              </View>
            ) : (
              <View style={s.handle} />
            )}
            {title && !compact ? (
              <Text
                accessibilityRole="header"
                maxFontSizeMultiplier={t.maxFontScale}
                style={s.title}
              >
                {title}
              </Text>
            ) : null}
          </View>
          <OverlayShown.Provider value={shown && visible}>
            {children}
          </OverlayShown.Provider>
        </Animated.View>
      </KeyboardAvoidingView>
      <ToastHost />
    </Modal>
  );
}

export type SheetOptionsProps<T extends string> = {
  items: readonly { value: T; label: string }[];
  value: T | null;
  onValueChange: (value: T) => void;
};

export function SheetOptions<T extends string>({
  items,
  value,
  onValueChange,
}: SheetOptionsProps<T>) {
  const s = useStyles();
  return (
    <ScrollView accessibilityRole="radiogroup" style={s.options}>
      {items.map((item) => (
        <ListRow
          key={item.value}
          title={item.label}
          chevron={false}
          trailing={item.value === value ? CheckGlyph : undefined}
          accessibilityRole="radio"
          accessibilityState={{ checked: item.value === value }}
          onPress={() => onValueChange(item.value)}
        />
      ))}
    </ScrollView>
  );
}
