export type HapticKind = 'select' | 'done' | 'error';

let handler: ((kind: HapticKind) => void) | null = null;

export function setHaptics(next: ((kind: HapticKind) => void) | null) {
  handler = next;
}

export function haptic(kind: HapticKind) {
  handler?.(kind);
}
