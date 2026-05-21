import type { CSSProperties, FC } from 'react';

import {
  getBlogCoverCssVariables,
  resolveBlogCoverSpec,
  type BlogCoverLocale,
  type BlogCoverSpec,
} from '@/lib/blog-cover';
import { cn } from '@/lib/utils';
import { BlogCoverBackground } from './BlogCoverBackground';
import { BlogCoverContent } from './BlogCoverContent';
import { BlogCoverDecorations } from './BlogCoverDecorations';

type BlogCoverVariant = 'hero' | 'card';
type BlogCoverRenderMode = 'full' | 'background';

export interface BlogCoverProps {
  readonly title: string;
  readonly excerpt: string;
  readonly lang: BlogCoverLocale;
  readonly routeSlug: string;
  readonly tags?: readonly string[] | undefined;
  readonly pubDate?: Date | string | number | undefined;
  readonly coverImageSrc?: string | undefined;
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
  coverImageSrc,
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
      data-has-raster-cover={coverImageSrc ? 'true' : 'false'}
      style={{ ...style, containerType: 'inline-size' }}
    >
      {coverImageSrc ? (
        <>
          <img
            src={coverImageSrc}
            alt=""
            loading="lazy"
            decoding="async"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-[1.01] object-cover"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(216,180,254,0.22),transparent_34%),radial-gradient(circle_at_85%_84%,rgba(96,165,250,0.18),transparent_38%),linear-gradient(90deg,rgba(3,7,18,0.52),rgba(3,7,18,0.18)_48%,rgba(3,7,18,0.42)),linear-gradient(180deg,rgba(3,7,18,0.1),rgba(3,7,18,0.54))]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.16] mix-blend-screen" />
        </>
      ) : (
        <>
          <BlogCoverBackground variant={variant} />
          <BlogCoverDecorations spec={spec} variant={variant} />
        </>
      )}
      {renderMode === 'full' ? (
        <BlogCoverContent spec={spec} excerpt={excerpt} variant={variant} />
      ) : null}
    </div>
  );
};

function getCoverStyle(spec: BlogCoverSpec) {
  const variables = getBlogCoverCssVariables(spec.theme);
  return variables as CSSProperties;
}

export default BlogCover;
