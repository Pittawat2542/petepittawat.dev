import BlogCover from '@/components/ui/blog/BlogCover';
import { getBlogPostRouteSlug } from '@/lib/blog-translations';
import type { BlogPost } from '@/types';
import type { FC } from 'react';
import { memo } from 'react';

interface BlogCardImageProps {
  readonly post: BlogPost;
  readonly tone?: 'default' | 'editorial' | undefined;
  readonly priority?: boolean | undefined;
}

const BlogCardImageComponent: FC<BlogCardImageProps> = ({
  post,
  tone = 'default',
  priority = false,
}) => {
  const coverImageSrc = post.data.coverImage?.src;
  const imageSizes =
    tone === 'editorial'
      ? '(min-width: 1024px) 36rem, (min-width: 768px) 50vw, 100vw'
      : '(min-width: 1024px) 28rem, (min-width: 768px) 50vw, 100vw';

  return (
    <BlogCover
      title={post.data.title}
      excerpt={post.data.excerpt}
      lang={post.data.lang}
      routeSlug={getBlogPostRouteSlug(post)}
      tags={post.data.tags}
      pubDate={post.data.pubDate}
      coverImageSrc={coverImageSrc}
      imageWidth={post.data.coverImage?.width}
      imageHeight={post.data.coverImage?.height}
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
    prevProps.priority === nextProps.priority
  );
});

BlogCardImage.displayName = 'BlogCardImage';
export default BlogCardImage;
