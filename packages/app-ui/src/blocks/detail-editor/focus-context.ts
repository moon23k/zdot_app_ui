import { createContext } from 'react';

export type DetailFocusRect = { y: number; height: number };

export const DetailFocusContext = createContext<
  ((rect: DetailFocusRect | null) => void) | null
>(null);

export type DetailPart = {
  key: string;
  kind: 'text' | 'image';
  y: number;
  height: number;
  line: number;
  blank?: boolean;
};

export const DetailPartsContext = createContext<
  ((parts: DetailPart[]) => void) | null
>(null);
