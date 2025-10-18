import type { CSSProperties, FC } from 'react';
import { memo, useMemo } from 'react';

interface BlogCardOverlaysProps {
  readonly accent?: string;
  readonly intensity?: 'default' | 'subtle';
}

const BlogCardOverlaysComponent: FC<BlogCardOverlaysProps> = ({
  accent = 'var(--card-accent, var(--page-accent, var(--accent)))',
  intensity = 'default',
}) => {
  const layers = useMemo(() => {
    const weight = intensity === 'subtle' ? 0.55 : 1;
    const tintOne = `linear-gradient(130deg, color-mix(in oklab, ${accent} ${24 * weight}%, transparent) 0%, color-mix(in oklab, ${accent} ${18 * weight}%, rgba(236, 72, 153, 0.3)) 48%, transparent 100%)`;
    const halo = `radial-gradient(120% 120% at 78% -10%, color-mix(in oklab, ${accent} ${42 * weight}%, rgba(255, 255, 255, 0.24)), transparent 70%)`;
    const bubble = `radial-gradient(circle, color-mix(in oklab, ${accent} ${38 * weight}%, rgba(255, 255, 255, 0.28)), transparent 72%)`;
    return {
      tintOne: tintOne as CSSProperties['background'],
      halo: halo as CSSProperties['background'],
      bubble: bubble as CSSProperties['background'],
    };
  }, [accent, intensity]);

  return (
    <>
      <div
        className="aurora-card__layer aurora-card__layer--tint"
        style={{ background: layers.tintOne }}
        aria-hidden="true"
      />
      <div
        className="aurora-card__layer aurora-card__layer--halo"
        style={{ background: layers.halo }}
        aria-hidden="true"
      />
      <div
        className="aurora-card__bubble"
        style={{ background: layers.bubble }}
        aria-hidden="true"
      />
    </>
  );
};

// Memoize the component (no props to compare)
export const BlogCardOverlays = memo(BlogCardOverlaysComponent);
BlogCardOverlays.displayName = 'BlogCardOverlays';
export default BlogCardOverlays;
