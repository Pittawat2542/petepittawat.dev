import type { BlogPost } from '@/types';
import type { FC } from 'react';
import { memo } from 'react';

interface BlogCardImageProps {
  readonly post: BlogPost;
}

const BlogCardImageComponent: FC<BlogCardImageProps> = ({ post }) => {
  if (post.data.coverImage?.src) {
    return (
      <div className="shape-squircle-sm overflow-hidden rounded-2xl">
        <img
          className="h-auto w-full transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.05] group-hover:rotate-[0.35deg]"
          src={post.data.coverImage.src}
          width={post.data.coverImage.width}
          height={post.data.coverImage.height}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw"
          alt={`Cover of the article: ${post.data.title}`}
        />
      </div>
    );
  }

  return (
    <div className="shape-squircle-sm rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(59,130,246,0.18),rgba(139,92,246,0.12))] p-5 text-[11px] tracking-[0.15em] text-white/70 uppercase md:p-6 md:text-xs">
      Field Notes
    </div>
  );
};

// Memoize the component with custom comparison
export const BlogCardImage = memo(BlogCardImageComponent, (prevProps, nextProps) => {
  return prevProps.post === nextProps.post;
});

BlogCardImage.displayName = 'BlogCardImage';
export default BlogCardImage;
