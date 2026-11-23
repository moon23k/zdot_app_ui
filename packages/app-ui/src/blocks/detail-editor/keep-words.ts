const JOIN = '\u2060';
const STICK = '\u00A0';
const HANGUL =
  /[\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7AF\uD7B0-\uD7FF]/;
const SPACE = /\s/;
const DOT_BEFORE = / (?=[\u00B7\u2022\u318D](?:\s|$))/g;
const WORD_BEFORE_NUMBER = /([\uAC00-\uD7A3]) (?=[0-9])/g;

function joinWord(word: string): string {
  const chars = Array.from(word);
  let out = chars[0] ?? '';
  for (let i = 1; i < chars.length; i += 1) {
    const prev = chars[i - 1]!;
    const next = chars[i]!;
    out += HANGUL.test(prev) || HANGUL.test(next) ? JOIN + next : next;
  }
  return out;
}

export function keepWords(text: string): string {
  if (!HANGUL.test(text)) return text;
  const glued = text
    .replace(DOT_BEFORE, STICK)
    .replace(WORD_BEFORE_NUMBER, `$1${STICK}`);
  let out = '';
  let word = '';
  for (const ch of glued) {
    if (SPACE.test(ch) && ch !== STICK) {
      out += joinWord(word) + ch;
      word = '';
    } else {
      word += ch;
    }
  }
  return out + joinWord(word);
}
