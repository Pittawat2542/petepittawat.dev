import type { FC } from 'react';

interface BlogCoverBackgroundProps {
  readonly variant: 'hero' | 'card';
}

export const BlogCoverBackground: FC<BlogCoverBackgroundProps> = ({ variant }) => (
  <>
    <div
      className="absolute inset-0"
      style={{
        background:
          'linear-gradient(145deg, var(--blog-cover-base-start), var(--blog-cover-base-end))',
      }}
    />
    <div
      className="absolute inset-0 opacity-95"
      style={{
        background: [
          'radial-gradient(circle at 14% 14%, var(--blog-cover-spot-primary), transparent 50%)',
          'radial-gradient(circle at 84% 72%, var(--blog-cover-spot-secondary), transparent 58%)',
          'linear-gradient(180deg, rgba(255,255,255,0.06), transparent 32%)',
        ].join(','),
      }}
    />
    <div
      className="absolute inset-[1px] rounded-[inherit] opacity-90"
      style={{
        background:
          'linear-gradient(155deg, var(--blog-cover-surface-start), var(--blog-cover-surface-end))',
      }}
    />
    <div
      className="blog-cover-grid absolute inset-0 opacity-45 mix-blend-screen"
      style={{
        backgroundImage:
          'linear-gradient(var(--blog-cover-grid) 1px, transparent 1px), linear-gradient(90deg, var(--blog-cover-grid) 1px, transparent 1px)',
        backgroundSize: variant === 'hero' ? '140px 140px' : '96px 96px',
        transform: 'rotate(4deg) scale(1.08)',
      }}
    />
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          'radial-gradient(120% 100% at 100% 0%, rgba(255,255,255,0.12), transparent 42%)',
      }}
    />
  </>
);
