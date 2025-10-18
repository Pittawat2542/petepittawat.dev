import { memo, type FC } from 'react';
import { createAccentStyle } from '@/lib/utils';

interface CardProps {
  readonly href: string;
  readonly ariaLabel: string;
  readonly title: string;
  readonly count: number;
  readonly linkText: string;
  readonly icon: string;
  readonly accentColor: string;
}

const HomeCardComponent: FC<CardProps> = ({
  href,
  ariaLabel,
  title,
  count,
  linkText,
  icon,
  accentColor,
}) => {
  const cardStyle = createAccentStyle(accentColor);
  return (
    <li className="h-full">
      <a
        href={href}
        aria-label={ariaLabel}
        className="group glass-card shape-squircle block h-full rounded-3xl p-5 transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out will-change-transform md:p-6"
        style={cardStyle}
      >
        <figure className="relative">
          {/* Enhanced glass frame with gradient accents */}
          <div
            className="glass-surface shape-squircle-sm rounded-2xl p-3"
            style={{
              background:
                'linear-gradient(135deg, color-mix(in oklab, var(--card-accent) 18%, transparent) 0%, transparent 55%)',
            }}
          >
            <div className="glass-surface-elevated shape-squircle-sm flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-xl transition-transform duration-200 ease-out will-change-transform group-hover:scale-[1.02]">
              <div
                className="relative flex h-full w-full items-center justify-center"
                dangerouslySetInnerHTML={{ __html: icon }}
              >
                {/* Subtle gradient overlay */}
                <div
                  className="shape-squircle-sm absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style={{
                    background:
                      'linear-gradient(45deg, color-mix(in oklab, var(--card-accent) 22%, transparent) 0%, transparent 100%)',
                  }}
                />
              </div>
            </div>
          </div>
          {/* Enhanced glow effect */}
          <div
            className="shape-squircle pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
            style={{
              background:
                'radial-gradient(circle at center, color-mix(in oklab, var(--card-accent) 24%, transparent) 0%, transparent 70%)',
              boxShadow:
                '0 0 0 1px color-mix(in oklab, var(--card-accent) 32%, transparent), 0 20px 60px -20px color-mix(in oklab, var(--card-accent) 45%, transparent)',
            }}
          />
        </figure>

        <div className="mt-5 space-y-2 text-center">
          <p
            className="text-xs font-semibold tracking-wider uppercase"
            style={{
              color: 'var(--card-accent)',
              opacity: 0.9,
            }}
          >
            {title}
          </p>
          <p className="bg-gradient-to-br from-[color:var(--card-accent)] via-[color:var(--card-accent)]/80 to-[color:var(--card-accent)]/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent transition-colors duration-150 group-hover:from-[color:var(--card-accent)]/90 group-hover:to-[color:var(--card-accent)]/70">
            {count}
          </p>
          <div
            className="glass-surface mt-3 inline-block rounded-full px-3 py-1.5"
            style={{
              background:
                'linear-gradient(135deg, color-mix(in oklab, var(--card-accent) 16%, transparent) 0%, color-mix(in oklab, var(--card-accent) 26%, transparent) 100%)',
            }}
          >
            <span
              className="text-sm font-medium transition-[color,font-weight] duration-150 group-hover:font-semibold"
              style={{
                color: 'var(--card-accent)',
              }}
            >
              {linkText}
            </span>
          </div>
        </div>
      </a>
    </li>
  );
};

const HomeCard = memo(HomeCardComponent);
HomeCard.displayName = 'HomeCard';

export default HomeCard;
export { HomeCard };
