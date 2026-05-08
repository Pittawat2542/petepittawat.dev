import { memo, useState, type FC } from 'react';

import { getCardVisualFallbackStyle, type CardVisualSpec } from '@/lib/card-visual';
import { cn } from '@/lib/utils';

interface CardVisualPanelProps {
  readonly spec: CardVisualSpec;
  readonly className?: string | undefined;
}

const CardVisualPanelComponent: FC<CardVisualPanelProps> = ({ spec, className }) => {
  const [showImage, setShowImage] = useState(true);

  return (
    <div
      className={cn(
        'shape-squircle-sm relative isolate mb-5 aspect-[16/7] overflow-hidden rounded-[1.35rem] border border-white/10 shadow-[0_22px_48px_-34px_rgba(3,7,18,0.86)]',
        className
      )}
      style={getCardVisualFallbackStyle(spec)}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--card-visual-base-start),var(--card-visual-base-end))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,var(--card-visual-spot-primary),transparent_48%),radial-gradient(circle_at_88%_78%,var(--card-visual-spot-secondary),transparent_54%),linear-gradient(120deg,transparent,rgba(255,255,255,0.08)_45%,transparent_72%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25 mix-blend-screen" />
      {showImage ? (
        <img
          src={spec.imagePath}
          alt=""
          loading="lazy"
          decoding="async"
          className="relative z-10 h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.025] group-hover:rotate-[0.18deg]"
          onError={() => {
            setShowImage(false);
          }}
        />
      ) : null}
      <div className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_36%,rgba(0,0,0,0.12))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-10 bg-gradient-to-t from-slate-950/28 to-transparent" />
    </div>
  );
};

export const CardVisualPanel = memo(CardVisualPanelComponent);
CardVisualPanel.displayName = 'CardVisualPanel';
export default CardVisualPanel;
