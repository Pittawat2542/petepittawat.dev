import { memo, type FC } from 'react';
import type { BlogPost } from '@/types';
import type { SuggestedReadingResult } from '@/lib/blog-recommendations';
import { getBlogPostPath } from '@/lib/blog-translations';
import FormattedDate from './FormattedDate';

interface RelatedPostsProps {
  readonly suggestions: SuggestedReadingResult<BlogPost>;
}

const RelatedPostsComponent: FC<RelatedPostsProps> = ({ suggestions }) => {
  const { mode, posts } = suggestions;
  if (!posts.length) return null;

  const title = mode === 'series-led' ? 'Continue the series' : 'Suggested reading';

  return (
    <section className="article-related-section reveal">
      <div className="article-related-header">
        <h2 className="article-related-title">{title}</h2>
      </div>
      <ul className="article-related-list">
        {posts.map(p => {
          const primaryTag = p.data.tags?.[0];
          const dateValue = p.data.pubDate;
          const dateIso =
            dateValue instanceof Date
              ? dateValue.toISOString()
              : dateValue
                ? String(dateValue)
                : undefined;
          return (
            <li key={p.id} className="article-related-card">
              <a
                href={getBlogPostPath(p)}
                className="article-related-link"
                aria-label={`Read ${p.data.title}`}
              >
                <span className="article-related-body">
                  <span className="article-related-meta-row">
                    {primaryTag ? (
                      <span className="article-related-chip">#{primaryTag}</span>
                    ) : null}
                    {dateIso ? (
                      <time className="article-related-date" dateTime={dateIso}>
                        <FormattedDate date={p.data.pubDate} />
                      </time>
                    ) : null}
                  </span>
                  <h3 className="article-related-heading">{p.data.title}</h3>
                  {p.data.excerpt ? (
                    <p className="article-related-excerpt">{p.data.excerpt}</p>
                  ) : null}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

const RelatedPosts = memo(RelatedPostsComponent);
RelatedPosts.displayName = 'RelatedPosts';

export default RelatedPosts;
export { RelatedPosts };
