import { createContext } from 'react';

export type TextMetrics = { size: number; tracking: number };

export const TextMetricsContext = createContext<TextMetrics | null>(null);
