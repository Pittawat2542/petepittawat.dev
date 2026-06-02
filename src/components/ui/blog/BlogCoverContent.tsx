import type { FC } from 'react';
import { SITE_CONFIG } from '@/lib/constants';
import type { BlogCoverSpec } from '@/lib/blog-cover';
import { cn } from '@/lib/utils';

interface BlogCoverContentProps {
  readonly spec: BlogCoverSpec;
  readonly excerpt: string;
  readonly variant: 'hero' | 'card';
}

const CoverChip: FC<{ label: string; subtle?: boolean | undefined }> = ({ label, subtle }) => (
  <span
    className={cn(
      'type-micro inline-flex items-center rounded-full border px-3 py-1 font-semibold tracking-[0.16em] uppercase',
      subtle
        ? 'border-white/12 bg-white/8 text-white/72'
        : 'text-[color:var(--blog-cover-accent-contrast)]'
    )}
    style={
      subtle
        ? undefined
        : {
            borderColor: 'var(--blog-cover-chip-border)',
            background: 'var(--blog-cover-chip-bg)',
          }
    }
  >
    {label}
  </span>
);

export const BlogCoverContent: FC<BlogCoverContentProps> = ({ spec, excerpt, variant }) => (
  <div className="blog-cover-content relative z-10 flex h-full w-full flex-col justify-between px-5 py-5 md:px-6 md:py-6 lg:px-8 lg:py-8">
    <div className="blog-cover-chips flex flex-wrap items-center gap-2">
      {spec.primaryTag ? <CoverChip label={spec.primaryTag.toUpperCase()} /> : null}
      <CoverChip label={spec.localeLabel} subtle />
      {variant === 'hero' && spec.publishedLabel ? (
        <CoverChip label={spec.publishedLabel} subtle />
      ) : null}
    </div>

    <div className="blog-cover-body relative z-10 flex flex-col">
      <div className="blog-cover-heading space-y-3">
        <p
          className={cn(
            'blog-cover-eyebrow m-0 font-semibold tracking-[0.24em] text-white/72 uppercase',
            variant === 'hero' ? 'type-caption md:type-meta' : 'type-micro md:type-caption'
          )}
        >
          {spec.eyebrowLabel}
        </p>
        <div
          className={cn(
            'blog-cover-title m-0 leading-[0.98] font-semibold tracking-[-0.035em] text-balance text-white',
            variant === 'hero' ? 'type-page-title' : 'type-card-title'
          )}
        >
          {spec.title}
        </div>
      </div>

      {variant === 'hero' && excerpt ? (
        <p className="blog-cover-excerpt m-0 max-w-[52ch] text-sm leading-6 text-white/74 md:text-base">
          {excerpt}
        </p>
      ) : null}
    </div>

    {variant === 'hero' ? (
      <div className="blog-cover-footer relative z-10 flex items-end justify-between gap-4">
        <div className="type-meta md:type-meta flex items-center gap-2 font-semibold tracking-[0.22em] text-white/76 uppercase">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{
              background: 'var(--blog-cover-accent)',
              boxShadow: '0 0 18px color-mix(in oklab, var(--blog-cover-accent) 48%, transparent)',
            }}
          />
          <span>{SITE_CONFIG.title}</span>
        </div>
        {spec.publishedLabel ? (
          <span className="blog-cover-date text-xs font-medium text-white/58">
            {spec.publishedLabel}
          </span>
        ) : null}
      </div>
    ) : null}
  </div>
);
