import { memo, type FC } from 'react';
import type { BlogPost } from '@/types';
import FormattedDate from './FormattedDate';

interface RelatedPostsProps {
  readonly posts: BlogPost[];
}

const RelatedPostsComponent: FC<RelatedPostsProps> = ({ posts }) => {
  if (!posts.length) return null;

  return (
    <section className="article-related-section reveal">
      <div className="article-related-header">
        <div className="article-related-badge">
          <span className="article-related-badge-dot" aria-hidden="true" />
          Keep reading
        </div>
        <h2 className="article-related-title">Related posts</h2>
        <p className="article-related-copy">
          Continue exploring adjacent research, playbooks, and hands-on experiments from the lab.
        </p>
      </div>
      <ul className="article-related-list">
        {posts.map((p, index) => {
          const position = index + 1;
          const primaryTag = p.data.tags?.[0];
          const dateValue = p.data.pubDate;
          const dateIso =
            dateValue instanceof Date
              ? dateValue.toISOString()
              : dateValue
                ? String(dateValue)
                : undefined;
          return (
            <li key={p.slug} className="article-related-card">
              <a
                href={`/blog/${String(p.slug)}`}
                className="article-related-link"
                aria-label={`Read ${p.data.title}`}
              >
                <span className="article-related-node" aria-hidden="true">
                  <span className="article-related-node__index">
                    {position.toString().padStart(2, '0')}
                  </span>
                  {index < posts.length - 1 ? (
                    <span className="article-related-node__connector" aria-hidden="true" />
                  ) : null}
                </span>
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
                  <span className="article-related-heading-wrap">
                    <h3 className="article-related-heading">{p.data.title}</h3>
                    <span className="article-related-cta">
                      Continue reading <span aria-hidden="true">→</span>
                    </span>
                  </span>
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
