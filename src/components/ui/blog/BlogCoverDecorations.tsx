import type { CSSProperties, FC } from 'react';
import {
  getBlogCoverDecorationSpec,
  type BlogCoverDecorationLayer,
  type BlogCoverDecorationTone,
  type BlogCoverSpec,
} from '@/lib/blog-cover';

interface BlogCoverDecorationsProps {
  readonly spec: BlogCoverSpec;
  readonly variant: 'hero' | 'card';
}

export const BlogCoverDecorations: FC<BlogCoverDecorationsProps> = ({ spec, variant }) => {
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
};

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
      return (
        <circle
          key={layer.id}
          {...commonProps}
          cx={svgNumber(layer.cx)}
          cy={svgNumber(layer.cy)}
          r={svgNumber(layer.r)}
        />
      );
    case 'ellipse':
      return (
        <ellipse
          key={layer.id}
          {...commonProps}
          cx={svgNumber(layer.cx)}
          cy={svgNumber(layer.cy)}
          rx={svgNumber(layer.rx)}
          ry={svgNumber(layer.ry)}
        />
      );
    case 'line':
      return (
        <line
          key={layer.id}
          {...commonProps}
          x1={svgNumber(layer.x1)}
          y1={svgNumber(layer.y1)}
          x2={svgNumber(layer.x2)}
          y2={svgNumber(layer.y2)}
        />
      );
    case 'path':
      return <path key={layer.id} {...commonProps} d={layer.d} />;
    case 'rect':
      return (
        <rect
          key={layer.id}
          {...commonProps}
          x={svgNumber(layer.x)}
          y={svgNumber(layer.y)}
          width={svgNumber(layer.width)}
          height={svgNumber(layer.height)}
          rx={svgNumber(layer.radius)}
        />
      );
    default:
      return null;
  }
}

function getLayerStyle(layer: BlogCoverDecorationLayer) {
  return layer.blur ? ({ filter: `blur(${svgNumber(layer.blur)}px)` } as CSSProperties) : undefined;
}

function getLayerTransform(layer: BlogCoverDecorationLayer) {
  if (!layer.rotation) {
    return undefined;
  }

  switch (layer.kind) {
    case 'circle':
    case 'ellipse':
      return `rotate(${svgNumber(layer.rotation)} ${svgNumber(layer.cx)} ${svgNumber(layer.cy)})`;
    case 'rect':
      return `rotate(${svgNumber(layer.rotation)} ${svgNumber(layer.x + layer.width / 2)} ${svgNumber(layer.y + layer.height / 2)})`;
    default:
      return undefined;
  }
}

function svgNumber(value: number) {
  return Number(value.toFixed(4));
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
