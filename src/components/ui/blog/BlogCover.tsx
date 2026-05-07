import type { CSSProperties, FC } from 'react';

import {
  SITE_TITLE,
  getBlogCoverDecorationSpec,
  getBlogCoverCssVariables,
  resolveBlogCoverSpec,
  type BlogCoverDecorationLayer,
  type BlogCoverDecorationTone,
  type BlogCoverLocale,
  type BlogCoverSpec,
} from '@/lib/blog-cover';
import { cn } from '@/lib/utils';

type BlogCoverVariant = 'hero' | 'card';
type BlogCoverRenderMode = 'full' | 'background';

export interface BlogCoverProps {
  readonly title: string;
  readonly excerpt: string;
  readonly lang: BlogCoverLocale;
  readonly routeSlug: string;
  readonly tags?: readonly string[] | undefined;
  readonly pubDate?: Date | string | number | undefined;
  readonly variant: BlogCoverVariant;
  readonly renderMode?: BlogCoverRenderMode | undefined;
  readonly className?: string | undefined;
}

const BlogCover: FC<BlogCoverProps> = ({
  title,
  excerpt,
  lang,
  routeSlug,
  tags = [],
  pubDate,
  variant,
  renderMode = 'full',
  className,
}) => {
  const spec = resolveBlogCoverSpec({
    title,
    excerpt,
    lang,
    routeSlug,
    tags,
    pubDate,
  });
  const style = getCoverStyle(spec);

  return (
    <div
      className={cn(
        'blog-cover-root relative isolate flex h-full w-full overflow-hidden rounded-[inherit] border border-white/10 text-white shadow-[0_24px_56px_-42px_rgba(4,10,24,0.92)]',
        variant === 'hero' ? 'min-h-[20rem]' : 'aspect-[1200/630]',
        className
      )}
      data-variant={variant}
      data-lang={lang}
      data-render-mode={renderMode}
      style={{ ...style, containerType: 'inline-size' }}
    >
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

      {renderDecorations(spec, variant)}

      {renderMode === 'full' ? (
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
                  variant === 'hero'
                    ? 'text-[0.68rem] md:text-[0.76rem]'
                    : 'text-[0.6rem] md:text-[0.66rem]'
                )}
              >
                {spec.eyebrowLabel}
              </p>
              <div
                className={cn(
                  'blog-cover-title m-0 leading-[0.98] font-semibold tracking-[-0.035em] text-balance text-white',
                  variant === 'hero'
                    ? 'text-[clamp(1.7rem,1.2rem+2vw,3.15rem)]'
                    : 'text-[clamp(1.02rem,0.92rem+0.6vw,1.52rem)]'
                )}
              >
                {spec.title}
              </div>
            </div>

            {variant === 'hero' && excerpt ? (
              <p
                className={cn(
                  'blog-cover-excerpt m-0 max-w-[52ch] text-sm leading-6 text-white/74 md:text-[0.98rem]'
                )}
              >
                {excerpt}
              </p>
            ) : null}
          </div>

          {variant === 'hero' ? (
            <div className="blog-cover-footer relative z-10 flex items-end justify-between gap-4">
              <div className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.22em] text-white/76 uppercase md:text-[0.76rem]">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{
                    background: 'var(--blog-cover-accent)',
                    boxShadow:
                      '0 0 18px color-mix(in oklab, var(--blog-cover-accent) 48%, transparent)',
                  }}
                />
                <span>{SITE_TITLE}</span>
              </div>
              {spec.publishedLabel ? (
                <span className="blog-cover-date text-[0.78rem] font-medium text-white/58">
                  {spec.publishedLabel}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

const CoverChip: FC<{ label: string; subtle?: boolean | undefined }> = ({ label, subtle }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-[0.62rem] font-semibold tracking-[0.16em] uppercase',
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
};

function getCoverStyle(spec: BlogCoverSpec) {
  const variables = getBlogCoverCssVariables(spec.theme);
  return variables as CSSProperties;
}

function renderDecorations(spec: BlogCoverSpec, variant: BlogCoverVariant) {
  const decoration = getBlogCoverDecorationSpec({
    seed: spec.seed,
    motif: spec.theme.motif,
    density: spec.theme.density,
    viewport: {
      width: 1200,
      height: 630,
      variant,
    },
  });

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
      viewBox="0 0 1200 630"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {decoration.layers.map(layer => renderDecorationLayer(layer))}
    </svg>
  );
}

function renderDecorationLayer(layer: BlogCoverDecorationLayer) {
  const commonProps = {
    fill: layer.fillTone ? resolveTone(layer.fillTone) : 'none',
    fillOpacity: layer.fillOpacity,
    stroke: layer.strokeTone ? resolveTone(layer.strokeTone) : 'none',
    strokeOpacity: layer.strokeOpacity,
    strokeWidth: layer.strokeWidth,
    style: getLayerStyle(layer),
    transform: getLayerTransform(layer),
  };

  switch (layer.kind) {
    case 'circle':
      return <circle key={layer.id} {...commonProps} cx={layer.cx} cy={layer.cy} r={layer.r} />;
    case 'ellipse':
      return (
        <ellipse
          key={layer.id}
          {...commonProps}
          cx={layer.cx}
          cy={layer.cy}
          rx={layer.rx}
          ry={layer.ry}
        />
      );
    case 'line':
      return (
        <line
          key={layer.id}
          {...commonProps}
          x1={layer.x1}
          y1={layer.y1}
          x2={layer.x2}
          y2={layer.y2}
        />
      );
    case 'path':
      return <path key={layer.id} {...commonProps} d={layer.d} />;
    case 'rect':
      return (
        <rect
          key={layer.id}
          {...commonProps}
          x={layer.x}
          y={layer.y}
          width={layer.width}
          height={layer.height}
          rx={layer.radius}
        />
      );
    default:
      return null;
  }
}

function getLayerStyle(layer: BlogCoverDecorationLayer) {
  return layer.blur ? ({ filter: `blur(${layer.blur}px)` } as CSSProperties) : undefined;
}

function getLayerTransform(layer: BlogCoverDecorationLayer) {
  if (!layer.rotation) {
    return undefined;
  }

  switch (layer.kind) {
    case 'circle':
      return `rotate(${layer.rotation} ${layer.cx} ${layer.cy})`;
    case 'ellipse':
      return `rotate(${layer.rotation} ${layer.cx} ${layer.cy})`;
    case 'rect':
      return `rotate(${layer.rotation} ${layer.x + layer.width / 2} ${layer.y + layer.height / 2})`;
    default:
      return undefined;
  }
}

function resolveTone(tone: BlogCoverDecorationTone) {
  switch (tone) {
    case 'accent':
      return 'var(--blog-cover-accent)';
    case 'accentSoft':
      return 'var(--blog-cover-accent-soft)';
    case 'accentStrong':
      return 'var(--blog-cover-accent-strong)';
    case 'accentContrast':
      return 'var(--blog-cover-accent-contrast)';
    case 'chipBorder':
      return 'var(--blog-cover-chip-border)';
    case 'gridColor':
      return 'var(--blog-cover-grid)';
    case 'spotPrimary':
      return 'var(--blog-cover-spot-primary)';
    case 'spotSecondary':
      return 'var(--blog-cover-spot-secondary)';
    case 'white':
      return 'rgba(255,255,255,0.84)';
    default:
      return 'transparent';
  }
}

export default BlogCover;
