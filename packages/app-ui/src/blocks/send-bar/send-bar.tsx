import { TextInput, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { SendGlyph } from '../../internal/glyphs';
import { useSwitch } from '../../internal/motion';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type SendBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  placeholder?: string;
  sendLabel?: string;
  disabled?: boolean;
  bottomInset?: number;
  style?: StyleProp<ViewStyle>;
};

const FIELD = 44;
const SEND_FROM = 0.82;

const useStyles = makeStyles((t) => ({
  root: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: t.space[2],
    paddingLeft: t.layout.screenX,
    paddingRight: t.space[3],
    paddingTop: t.space[2] + t.space[1] / 2,
    backgroundColor: t.colors.surface,
    borderTopWidth: 1,
    borderTopColor: t.colors.muted,
  },
  input: {
    flex: 1,
    minHeight: FIELD,
    maxHeight: FIELD * 3,
    paddingHorizontal: t.space[4],
    paddingVertical: t.space[2] + t.space[1] / 2,
    borderRadius: FIELD / 2,
    backgroundColor: t.colors.muted,
    fontFamily: t.fontFamily,
    fontSize: t.typography.body.fontSize,
    lineHeight: t.typography.body.lineHeight,
    color: t.colors.title,
  },
  send: {
    width: FIELD,
    height: FIELD,
    borderRadius: FIELD / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export function SendBar({
  value,
  onChangeText,
  onSend,
  placeholder,
  sendLabel = '전송',
  disabled,
  bottomInset = 0,
  style,
}: SendBarProps) {
  const t = useTheme();
  const s = useStyles();
  const off = disabled || !value.trim();
  const live = useSwitch(!off, 'spring', 'spring');
  const rest = t.colors.disabledSurface;
  const fill = t.colors.primary;
  const ready = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      Math.min(1, Math.max(0, live.value)),
      [0, 1],
      [rest, fill]
    ),
    transform: [{ scale: SEND_FROM + (1 - SEND_FROM) * live.value }],
  }));
  return (
    <View style={[s.root, { paddingBottom: t.space[3] + bottomInset }, style]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={t.colors.ring}
        multiline
        maxLength={1000}
        maxFontSizeMultiplier={t.maxFontScale}
        style={s.input}
      />
      <PressableBase
        accessibilityRole="button"
        accessibilityLabel={sendLabel}
        disabled={off}
        disabledStyle={{}}
        feedback="small"
        onPress={onSend}
        style={s.send}
      >
        <Animated.View style={[s.send, ready]}>
          <SendGlyph
            color={
              off ? t.colors.disabledForeground : t.colors.primaryForeground
            }
            size={t.iconSize.sm}
          />
        </Animated.View>
      </PressableBase>
    </View>
  );
}
