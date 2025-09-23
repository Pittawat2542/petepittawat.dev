import type { BlogPost } from '@/types';
import type { FC } from 'react';
import { memo } from 'react';

interface BlogCardImageProps {
  readonly post: BlogPost;
  readonly horizontalOnSingleColumn: boolean;
}

const BlogCardImageComponent: FC<BlogCardImageProps> = ({ post, horizontalOnSingleColumn }) => {
  if (post.data.coverImage?.src) {
    return (
      <div
        className={
          horizontalOnSingleColumn
            ? 'h-24 w-32 shrink-0 overflow-hidden rounded-2xl md:h-32 md:w-44 lg:h-auto lg:w-full'
            : 'overflow-hidden rounded-2xl'
        }
      >
        <img
          className={`${horizontalOnSingleColumn ? 'h-full w-full object-cover lg:h-auto lg:w-full' : 'h-auto w-full'} transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.05] group-hover:rotate-[0.35deg]`}
          src={post.data.coverImage.src}
          width={post.data.coverImage.width}
          height={post.data.coverImage.height}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          sizes={
            horizontalOnSingleColumn
              ? '(min-width: 1024px) 600px, 176px'
              : '(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw'
          }
          alt={`Cover of the article: ${post.data.title}`}
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(59,130,246,0.18),rgba(139,92,246,0.12))] p-6 text-xs tracking-[0.15em] text-white/70 uppercase">
      Field Notes
    </div>
  );
};

// Memoize the component with custom comparison
export const BlogCardImage = memo(BlogCardImageComponent, (prevProps, nextProps) => {
  return (
    prevProps.post === nextProps.post &&
    prevProps.horizontalOnSingleColumn === nextProps.horizontalOnSingleColumn
  );
});

BlogCardImage.displayName = 'BlogCardImage';
export default BlogCardImage;
