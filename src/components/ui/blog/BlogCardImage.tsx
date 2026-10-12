import type { ResponsiveCover } from '@/lib/responsive-cover';
import BlogCover from '@/components/ui/blog/BlogCover';
import { getBlogPostRouteSlug } from '@/lib/blog-translations';
import type { BlogPost } from '@/types';
import type { FC } from 'react';
import { memo } from 'react';

interface BlogCardImageProps {
  readonly cover?: ResponsiveCover | undefined;
  readonly post: BlogPost;
  readonly tone?: 'default' | 'editorial' | undefined;
  readonly priority?: boolean | undefined;
}

const BlogCardImageComponent: FC<BlogCardImageProps> = ({
  post,
  tone = 'default',
  priority = false,
  cover,
}) => {
  const coverImageSrc = cover?.src ?? post.data.coverImage?.src;
  // Lazy covers follow the concrete layout, including cards promoted by filtering.
  // The eager feature occupies 42% of the 72rem container above 1024px.
  const imageSizes = priority
    ? '(min-width: 1280px) 30.5rem, (min-width: 1024px) calc(42vw - 2.1rem), (min-width: 768px) calc(100vw - 5rem), calc(100vw - 3rem)'
    : 'auto, (min-width: 1280px) 36rem, (min-width: 1024px) 50vw, 100vw';

  return (
    <BlogCover
      title={post.data.title}
      excerpt={post.data.excerpt}
      lang={post.data.lang}
      routeSlug={getBlogPostRouteSlug(post)}
      tags={post.data.tags}
      pubDate={post.data.pubDate}
      coverImageSrc={coverImageSrc}
      imageSrcSet={cover?.srcSet}
      imageWidth={cover?.width ?? post.data.coverImage?.width}
      imageHeight={cover?.height ?? post.data.coverImage?.height}
      imageSizes={imageSizes}
      imageLoading={priority ? 'eager' : 'lazy'}
      imageFetchPriority={priority ? 'high' : 'low'}
      imageDecoding={priority ? 'sync' : 'async'}
      variant="card"
      renderMode="background"
      className={
        tone === 'editorial'
          ? 'rounded-none border-0 shadow-none transition-transform duration-500 ease-out group-hover:scale-[1.02]'
          : 'rounded-none border-0 shadow-none transition-transform duration-700 ease-out group-hover:scale-[1.025] group-hover:rotate-[0.25deg]'
      }
    />
  );
};

// Memoize the component with custom comparison
export const BlogCardImage = memo(BlogCardImageComponent, (prevProps, nextProps) => {
  return (
    prevProps.post === nextProps.post &&
    prevProps.tone === nextProps.tone &&
    prevProps.priority === nextProps.priority &&
    prevProps.cover === nextProps.cover
  );
});

BlogCardImage.displayName = 'BlogCardImage';
export default BlogCardImage;
