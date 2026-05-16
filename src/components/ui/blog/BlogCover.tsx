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
      <BlogCoverBackground variant={variant} />
      <BlogCoverDecorations spec={spec} variant={variant} />
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
