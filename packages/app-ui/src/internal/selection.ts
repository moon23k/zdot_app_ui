export function nextSingle<T>(
  current: T | null,
  value: T,
  deselectable = false
): T | null | undefined {
  if (current !== value) return value;
  return deselectable ? null : undefined;
}

export function nextMultiple<T>(
  current: readonly T[],
  value: T,
  max?: number
): T[] | undefined {
  if (current.includes(value)) return current.filter((x) => x !== value);
  if (max === undefined || current.length < max) return [...current, value];
  return undefined;
}
