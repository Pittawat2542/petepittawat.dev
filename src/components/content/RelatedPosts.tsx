import '@/styles/components/related-posts.css';
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
  const isSeriesLed = mode === 'series-led';

  return (
    <section className="article-related-section reveal">
      <div className="article-related-header">
        <h2 className="article-related-title">{title}</h2>
      </div>
      <ul className={`article-related-list ${isSeriesLed ? 'article-related-list--series' : ''}`}>
        {posts.map((p, index) => {
          const primaryTag = p.data.tags?.[0];
          const dateValue = p.data.pubDate;
          const dateIso =
            dateValue instanceof Date
              ? dateValue.toISOString()
              : dateValue
                ? String(dateValue)
                : undefined;
          const isPrimarySeriesCard = isSeriesLed && index === 0;
          const cueLabel = isPrimarySeriesCard ? 'Continue' : 'Read article';

          return (
            <li
              key={p.id}
              className={`article-related-card ${isPrimarySeriesCard ? 'article-related-card--primary' : 'article-related-card--secondary'}`}
            >
              <a
                href={getBlogPostPath(p)}
                className="article-related-link"
                aria-label={`${cueLabel}: ${p.data.title}`}
              >
                <span className="article-related-body">
                  <span className="article-related-meta-row">
                    <span className="article-related-meta-group">
                      {primaryTag ? (
                        <span className="article-related-chip">#{primaryTag}</span>
                      ) : null}
                      {dateIso ? (
                        <time className="article-related-date" dateTime={dateIso}>
                          <FormattedDate date={p.data.pubDate} />
                        </time>
                      ) : null}
                    </span>
                    <span className="article-related-kicker">
                      {isPrimarySeriesCard ? 'Next in series' : cueLabel}
                    </span>
                  </span>
                  <span className="article-related-copy">
                    <h3 className="article-related-heading">{p.data.title}</h3>
                    {p.data.excerpt ? (
                      <p className="article-related-excerpt">{p.data.excerpt}</p>
                    ) : null}
                  </span>
                  <span className="article-related-footer">
                    <span className="article-related-cta">{cueLabel}</span>
                    <span className="article-related-arrow" aria-hidden="true">
                      →
                    </span>
                  </span>
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
