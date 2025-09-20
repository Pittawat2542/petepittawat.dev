import type { BlogPost } from '../../types';

type Props = {
  post: BlogPost;
  horizontalOnSingleColumn: boolean;
};

export default function BlogCardImage({ post, horizontalOnSingleColumn }: Readonly<Props>) {
  if (post.data.coverImage?.src) {
    return (
      <div className={horizontalOnSingleColumn ? 'overflow-hidden rounded-2xl shrink-0 w-32 h-24 md:w-44 md:h-32 lg:w-full lg:h-auto' : 'overflow-hidden rounded-2xl'}>
        <img
          className={`${horizontalOnSingleColumn ? 'h-full w-full object-cover lg:h-auto lg:w-full' : 'w-full h-auto'} transition-transform duration-700 ease-out group-hover:scale-[1.05] group-hover:rotate-[0.35deg] will-change-transform`}
          src={post.data.coverImage.src}
          width={post.data.coverImage.width}
          height={post.data.coverImage.height}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          sizes={horizontalOnSingleColumn ? '(min-width: 1024px) 600px, 176px' : '(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw'}
          alt={`Cover of the article: ${post.data.title}`}
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(59,130,246,0.18),rgba(139,92,246,0.12))] p-6 text-xs uppercase tracking-[0.15em] text-white/70">
      Field Notes
    </div>
  );
}