export type TimeRange = '1' | '7' | '30';

export const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  '1': '24h',
  '7': '7d',
  '30': '1m'
};

export const DEFAULT_TIME_RANGE: TimeRange = '7';