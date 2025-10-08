export interface SparkConfig {
  readonly id: string;
  readonly delay: number;
  readonly distance: string;
  readonly size: string;
}

export const SPARKS: readonly SparkConfig[] = [
  { id: 'alpha', delay: 0, distance: '1.35rem', size: '0.42rem' },
  { id: 'beta', delay: 2.8, distance: '1.6rem', size: '0.36rem' },
  { id: 'gamma', delay: 4.4, distance: '1.05rem', size: '0.32rem' },
] as const;

export const ACCENT_COLOR = 'var(--accent, #6ac1ff)';
