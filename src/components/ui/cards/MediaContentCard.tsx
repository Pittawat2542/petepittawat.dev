import { BlogCardOverlays } from '@/components/ui/blog/BlogCardOverlays';
import { cn, createAccentStyle } from '@/lib/utils';
import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react';

interface MediaContentCardProps extends HTMLAttributes<HTMLElement> {
  readonly accent: string;
  readonly media: ReactNode;
  readonly mediaBadges?: ReactNode | undefined;
  readonly footer?: ReactNode | undefined;
  readonly featured?: boolean | undefined;
  readonly as?: ElementType | undefined;
  readonly bodyClassName?: string | undefined;
  readonly mediaClassName?: string | undefined;
  readonly footerClassName?: string | undefined;
  readonly overlayIntensity?: 'default' | 'subtle' | undefined;
  readonly href?: string | undefined;
  readonly target?: string | undefined;
  readonly rel?: string | undefined;
  readonly type?: 'button' | 'submit' | 'reset' | undefined;
  readonly children: ReactNode;
}

export default function MediaContentCard({
  accent,
  media,
  mediaBadges,
  footer,
  featured = false,
  as,
  className,
  bodyClassName,
  mediaClassName,
  footerClassName,
  overlayIntensity = 'subtle',
  children,
  style,
  ...rest
}: MediaContentCardProps) {
  const Component = as ?? 'article';
  const cardStyle = {
    ...createAccentStyle(accent),
    ...style,
  } as CSSProperties;

  return (
    <Component
      {...rest}
      className={cn('media-card group', featured && 'media-card--featured', className)}
      style={cardStyle}
    >
      <BlogCardOverlays accent="var(--card-accent)" intensity={overlayIntensity} />
      <div className={cn('media-card__media', mediaClassName)}>
        {media}
        {mediaBadges ? <div className="media-card__badges">{mediaBadges}</div> : null}
      </div>
      <div className={cn('media-card__body', bodyClassName)}>{children}</div>
      {footer ? <div className={cn('media-card__footer', footerClassName)}>{footer}</div> : null}
    </Component>
  );
}
