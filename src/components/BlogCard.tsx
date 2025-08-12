import type { BlogPost } from '../types';

type Props = {
  post: BlogPost;
  featured?: boolean;
};

export default function BlogCard({ post, featured = false }: Readonly<Props>) {
  return (
    <li className={`cursor-pointer glass-card group w-full h-full hyphens-auto ${featured ? 'card-featured' : ''}`}>
      <a
        className="flex flex-col align-middle p-6 h-full text-[color:var(--white)] hover:text-[color:var(--white)] focus-visible:text-[color:var(--white)]"
        href={`/blog/${post.slug}/`}
      >
        {post.data.coverImage?.src ? (
          <div className="mb-6 overflow-hidden rounded-xl">
            <img
              className="w-full h-auto transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"
              src={post.data.coverImage.src}
              width={post.data.coverImage.width}
              height={post.data.coverImage.height}
              loading="lazy"
              decoding="async"
              alt={post.data.title}
            />
          </div>
        ) : null}
        <h4 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-[color:var(--accent)]">
          {post.data.title}
        </h4>
        <p className="italic opacity-80">
          Published on{' '}
          <time dateTime={post.data.pubDate.toISOString()}>
            {post.data.pubDate.toLocaleDateString('en-us', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </time>
        </p>
        <p className="mt-3 text-justify leading-6 text-[color:var(--white)]/80">
          {post.data.excerpt}
        </p>
      </a>
    </li>
  );
}
