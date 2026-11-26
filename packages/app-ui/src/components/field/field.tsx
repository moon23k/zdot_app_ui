import {
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentRef,
  type Ref,
} from 'react';
import {
  Text,
  Keyboard,
  Platform,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import Animated, {
  FadeIn,
  LinearTransition,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { FieldLabel } from '../../internal/field-label';
import { AlertGlyph } from '../../internal/glyphs';
import { PopCheck } from '../../internal/pop-check';
import { renderIcon, type IconSlot } from '../../internal/icon';
import { useShake, useSwitch } from '../../internal/motion';
import { OverlayShown } from '../../internal/overlay';
import { PressableBase } from '../../internal/pressable-base';
import { useReducedMotion } from '../../internal/use-reduced-motion';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';
import { haptic } from '../../internal/haptics';

export type FieldProps = Omit<TextInputProps, 'style'> & {
  ref?: Ref<ComponentRef<typeof TextInput>>;
  label?: string;
  readOnly?: boolean;
  error?: string;
  hint?: string;
  warning?: string;
  leading?: IconSlot;
  trailing?: IconSlot;
  onTrailingPress?: () => void;
  trailingLabel?: string;
  valid?: boolean;
  showCount?: boolean;
  style?: StyleProp<ViewStyle>;
};

const RECESS_HEIGHT = 50;

const useStyles = makeStyles((t) => ({
  root: { gap: t.space[2] },
  frame: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[2],
    height: t.controlSize.lg,
    paddingHorizontal: t.space[4],
    borderRadius: t.radius.lg,
    borderWidth: 1,
    borderColor: t.colors.line,
    backgroundColor: t.colors.surface,
  },
  raised: {
    borderColor: 'transparent',
    backgroundColor: t.colors.raised,
    boxShadow: t.shadow.lift,
  },
  multi: {
    height: 'auto',
    minHeight: t.controlSize.lg * 3,
    alignItems: 'flex-start',
    paddingVertical: t.space[3],
  },
  multiInput: { textAlignVertical: 'top' },
  focused: {
    borderColor: t.colors.primary,
    boxShadow: `0px 0px 0px 4px ${t.colors.focusRing}`,
  },
  raisedFocused: {
    borderColor: t.colors.primary,
    boxShadow: `${t.shadow.lift}, 0px 0px 0px 4px ${t.colors.focusRing}`,
  },
  recess: {
    height: RECESS_HEIGHT,
    borderColor: 'transparent',
    backgroundColor: t.colors.recess,
  },
  recessFocused: {
    borderColor: t.colors.primary,
    backgroundColor: t.colors.raised,
    boxShadow: `0px 0px 0px 4px ${t.colors.focusRing}`,
  },
  invalid: { borderColor: t.colors.danger },
  disabled: { opacity: t.opacity.disabled, backgroundColor: t.colors.muted },
  readOnly: { borderColor: t.colors.muted, backgroundColor: t.colors.muted },
  input: {
    flex: 1,
    minWidth: 0,
    alignSelf: 'stretch',
    paddingVertical: 0,
    fontFamily: t.fontFamily,
    fontSize: t.typography.bodyLg.fontSize,
    letterSpacing: t.typography.bodyLg.letterSpacing,
    color: t.colors.foreground,
  },
  error: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.label.fontSize,
    letterSpacing: t.typography.label.letterSpacing,
    lineHeight: t.typography.label.lineHeight,
    paddingLeft: t.space[1],
    color: t.colors.danger,
  },
  warned: { borderColor: t.colors.warningText },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: t.space[1],
    paddingLeft: t.space[1],
  },
  grow: { flex: 1, paddingLeft: 0 },
  hint: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.label.fontSize,
    letterSpacing: t.typography.label.letterSpacing,
    lineHeight: t.typography.label.lineHeight,
    paddingLeft: t.space[1],
    color: t.colors.mutedForeground,
  },
  warning: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.label.fontSize,
    letterSpacing: t.typography.label.letterSpacing,
    lineHeight: t.typography.label.lineHeight,
    paddingLeft: t.space[1],
    color: t.colors.foreground,
  },
}));

const RETRIES = 3;

export function Field(props: FieldProps) {
  return <FieldBase {...props} />;
}

export function FieldBase({
  raised = false,
  recess = false,
  label,
  readOnly = false,
  error,
  hint,
  warning,
  leading,
  trailing,
  onTrailingPress,
  trailingLabel,
  valid,
  showCount = false,
  style,
  editable = true,
  onFocus,
  onBlur,
  ref,
  autoFocus,
  ...input
}: FieldProps & { raised?: boolean; recess?: boolean }) {
  const t = useTheme();
  const reduced = useReducedMotion();
  const s = useStyles();
  const [focused, setFocused] = useState(false);
  const icon = { color: t.colors.mutedForeground, size: t.iconSize.md };
  const warn = error ? undefined : warning;
  const note = error ?? warn ?? hint;
  const thick = useSwitch(!!error || !!warn, 'press');
  const shake = useShake(error);
  useEffect(() => {
    if (error) haptic('error');
  }, [error]);
  const shown = useContext(OverlayShown);
  const own = useRef<ComponentRef<typeof TextInput> | null>(null);
  const quiet = useRef(false);
  const retryAfter = t.motion.duration.long;
  useEffect(() => {
    const node = own.current;
    if (!autoFocus || !shown || !node) return;
    node.focus();
    if (Platform.OS !== 'android') return;
    let tries = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const check = () => {
      quiet.current = false;
      if (Keyboard.isVisible() || !node.isFocused() || tries >= RETRIES) return;
      tries += 1;
      quiet.current = true;
      node.blur();
      node.focus();
      timer = setTimeout(check, retryAfter);
    };
    timer = setTimeout(check, retryAfter);
    const seen = Keyboard.addListener('keyboardDidShow', () =>
      clearTimeout(timer)
    );
    return () => {
      clearTimeout(timer);
      seen.remove();
    };
  }, [autoFocus, shown, retryAfter]);
  const attach = (node: ComponentRef<typeof TextInput> | null) => {
    own.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };
  const inset = t.space[4];
  const edge = useAnimatedStyle(() => ({
    borderWidth: 1 + thick.value,
    paddingHorizontal: inset - thick.value,
    transform: [{ translateX: shake.value }],
  }));

  return (
    <Animated.View
      layout={LinearTransition.duration(t.motion.duration.press)}
      style={[s.root, style]}
    >
      <FieldLabel
        label={label}
        count={
          showCount && input.maxLength !== undefined
            ? `${(input.value ?? '').length}/${input.maxLength}`
            : undefined
        }
        error={!!error}
      />
      <Animated.View
        style={[
          s.frame,
          input.multiline && s.multi,
          raised && s.raised,
          recess && s.recess,
          focused &&
            (recess ? s.recessFocused : raised ? s.raisedFocused : s.focused),
          !!error && s.invalid,
          !!warn && s.warned,
          readOnly ? s.readOnly : !editable && s.disabled,
          edge,
        ]}
      >
        {leading ? renderIcon(leading, icon) : null}
        <TextInput
          placeholderTextColor={
            recess ? t.colors.faint : t.colors.mutedForeground
          }
          selectionColor={t.colors.primary}
          cursorColor={t.colors.primary}
          maxFontSizeMultiplier={t.maxFontScale}
          accessibilityLabel={label}
          accessibilityHint={note}
          {...input}
          ref={attach}
          autoFocus={autoFocus && shown !== false}
          editable={editable && !readOnly}
          style={[s.input, input.multiline && s.multiInput]}
          onFocus={(e) => {
            setFocused(true);
            if (quiet.current) {
              quiet.current = false;
              return;
            }
            onFocus?.(e);
          }}
          onBlur={(e) => {
            if (quiet.current) return;
            setFocused(false);
            onBlur?.(e);
          }}
        />
        {valid !== undefined && !error ? (
          <PopCheck on={valid} size={t.iconSize.md} />
        ) : null}
        {trailing && onTrailingPress ? (
          <PressableBase
            accessibilityRole="button"
            accessibilityLabel={trailingLabel}
            hitSlop={(t.minTouchSize - t.iconSize.md) / 2}
            onPress={onTrailingPress}
          >
            {renderIcon(trailing, { ...icon, color: t.colors.foreground })}
          </PressableBase>
        ) : error ? (
          <AlertGlyph
            filled
            color={t.colors.danger}
            onColor={t.colors.dangerForeground}
            size={t.iconSize.md}
          />
        ) : trailing ? (
          renderIcon(trailing, icon)
        ) : null}
      </Animated.View>
      {error ? (
        <Animated.Text
          entering={
            reduced ? undefined : FadeIn.duration(t.motion.duration.press)
          }
          maxFontSizeMultiplier={t.maxFontScale}
          accessibilityLiveRegion="polite"
          style={s.error}
        >
          {error}
        </Animated.Text>
      ) : warn ? (
        <View style={s.noteRow}>
          <AlertGlyph
            filled
            color={t.colors.warningText}
            onColor={t.colors.background}
            size={t.iconSize.sm}
          />
          <Text
            maxFontSizeMultiplier={t.maxFontScale}
            accessibilityLiveRegion="polite"
            style={[s.warning, s.grow]}
          >
            {warn}
          </Text>
        </View>
      ) : hint ? (
        <Text maxFontSizeMultiplier={t.maxFontScale} style={s.hint}>
          {hint}
        </Text>
      ) : null}
    </Animated.View>
  );
}
