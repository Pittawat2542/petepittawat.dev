import { BlogCardOverlays } from '@/components/ui/blog/BlogCardOverlays';
import { cn, createAccentStyle } from '@/lib/utils';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

interface AuroraCardShellProps extends HTMLAttributes<HTMLElement> {
  readonly accent: string;
  readonly children: ReactNode;
  readonly footer?: ReactNode;
  readonly featured?: boolean;
  readonly overlayIntensity?: 'default' | 'subtle';
  readonly bodyClassName?: string;
  readonly tone?: 'default' | 'editorial';
}

export default function AuroraCardShell({
  accent,
  children,
  footer,
  featured = false,
  overlayIntensity = 'default',
  className,
  bodyClassName,
  tone = 'editorial',
  style,
  ...rest
}: AuroraCardShellProps) {
  const cardStyle = {
    ...createAccentStyle(accent),
    ...style,
  } as CSSProperties;

  return (
    <article
      {...rest}
      className={cn(
        tone === 'editorial'
          ? 'group flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.12),transparent_28%),linear-gradient(180deg,rgba(11,20,38,0.95),rgba(8,15,29,0.97))] text-white shadow-[0_30px_70px_-42px_rgba(3,7,18,0.82)] transition-[transform,box-shadow,border-color] duration-[var(--motion-duration-slow)] ease-[var(--motion-ease-decelerate)] will-change-transform'
          : 'aurora-card group flex flex-col will-change-transform',
        featured && 'aurora-card--featured',
        className
      )}
      style={cardStyle}
    >
      {tone === 'default' ? <div className="aurora-card__wrapper" /> : null}
      <BlogCardOverlays accent={accent} intensity={overlayIntensity} />
      <div
        className={cn(
          tone === 'editorial' ? 'flex flex-1 flex-col' : 'aurora-card__body',
          bodyClassName
        )}
      >
        {children}
      </div>
      {footer ? (
        <div
          className={cn(
            tone === 'editorial' &&
              'mt-auto border-t border-white/10 bg-white/[0.02] px-5 py-4 md:px-6 lg:px-7'
          )}
        >
          {footer}
        </div>
      ) : null}
    </article>
  );
}
