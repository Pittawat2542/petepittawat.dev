import BlogCover from '@/components/ui/blog/BlogCover';
import { getBlogPostRouteSlug } from '@/lib/blog-translations';
import type { BlogPost } from '@/types';
import type { FC } from 'react';
import { memo } from 'react';

interface BlogCardImageProps {
  readonly post: BlogPost;
}

const BlogCardImageComponent: FC<BlogCardImageProps> = ({ post }) => {
  return (
    <div className="shape-squircle-sm overflow-hidden rounded-2xl">
      <BlogCover
        title={post.data.title}
        excerpt={post.data.excerpt}
        lang={post.data.lang}
        routeSlug={getBlogPostRouteSlug(post)}
        tags={post.data.tags}
        pubDate={post.data.pubDate}
        variant="card"
        className="transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.025] group-hover:rotate-[0.25deg]"
      />
    </div>
  );
};

// Memoize the component with custom comparison
export const BlogCardImage = memo(BlogCardImageComponent, (prevProps, nextProps) => {
  return prevProps.post === nextProps.post;
});

BlogCardImage.displayName = 'BlogCardImage';
export default BlogCardImage;
