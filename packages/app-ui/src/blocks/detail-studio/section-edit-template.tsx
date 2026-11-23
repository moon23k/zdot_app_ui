import {
  useEffect,
  useRef,
  useState,
  type ComponentRef,
  type ReactNode,
} from 'react';
import { Keyboard, KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';
import {
  DetailFocusContext,
  type DetailFocusRect,
} from '../detail-editor/focus-context';

export type SectionEditTemplateProps = {
  bar: ReactNode;
  children: ReactNode;
  accessory?: ReactNode;
  panel?: ReactNode;
  sheet?: ReactNode;
  bottomInset?: number;
};

const useStyles = makeStyles((t) => ({
  root: { flex: 1, backgroundColor: t.colors.surface },
  scroll: { flex: 1 },
  accessory: { backgroundColor: t.colors.surface },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0 },
}));

function useKeyboardShown() {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setShown(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setShown(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return shown;
}

export function SectionEditTemplate({
  bar,
  children,
  accessory,
  panel,
  sheet,
  bottomInset = 0,
}: SectionEditTemplateProps) {
  const t = useTheme();
  const s = useStyles();
  const keyboard = useKeyboardShown();
  const scroller = useRef<ComponentRef<typeof ScrollView>>(null);
  const offset = useRef(0);
  const pageTop = useRef(0);
  const [height, setHeight] = useState(0);
  const [sheetHeight, setSheetHeight] = useState(0);
  const [focus, setFocus] = useState<DetailFocusRect | null>(null);
  const report = useRef((rect: DetailFocusRect | null) =>
    setFocus((now) =>
      now === rect ||
      (now && rect && now.y === rect.y && now.height === rect.height)
        ? now
        : rect
    )
  ).current;
  const margin = t.space[4];
  const viewport = height - sheetHeight;

  useEffect(() => {
    if (!focus || viewport <= 0) return;
    const top = pageTop.current + focus.y - margin;
    const end = pageTop.current + focus.y + focus.height + margin;
    const now = offset.current;
    const next =
      end - top > viewport || top < now
        ? top
        : end > now + viewport
          ? end - viewport
          : now;
    if (next !== now) {
      scroller.current?.scrollTo({ y: Math.max(0, next), animated: true });
    }
  }, [focus, viewport, margin]);

  const docked = !!accessory || !!panel;
  const below = !panel && !keyboard ? bottomInset : 0;

  return (
    <KeyboardAvoidingView behavior="padding" style={s.root}>
      {bar}
      <ScrollView
        ref={scroller}
        style={s.scroll}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: sheetHeight + (docked ? 0 : bottomInset),
        }}
        scrollEventThrottle={16}
        onScroll={(e) => {
          offset.current = e.nativeEvent.contentOffset.y;
        }}
        onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
      >
        <DetailFocusContext.Provider value={report}>
          <View
            onLayout={(e) => {
              pageTop.current = e.nativeEvent.layout.y;
            }}
          >
            {children}
          </View>
        </DetailFocusContext.Provider>
      </ScrollView>
      {accessory ? (
        <View style={[s.accessory, { paddingBottom: below }]}>{accessory}</View>
      ) : null}
      {panel}
      <View pointerEvents="box-none" style={s.sheet}>
        <View
          pointerEvents="box-none"
          onLayout={(e) => setSheetHeight(e.nativeEvent.layout.height)}
        >
          {sheet}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
