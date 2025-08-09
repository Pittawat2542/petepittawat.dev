import React from 'react';

export type Artifact = { label: string; href: string };
export type Publication = {
  year: number;
  type: 'journal' | 'conference' | 'preprint' | string;
  title: string;
  authors: string;
  venue: string;
  url: string | null;
  artifacts: Artifact[];
  tags: string[];
};

export function PublicationCard({ item }: { item: Publication }) {
  return (
    <article className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-base md:text-lg font-semibold leading-snug">
            {item.url ? (
              <a href={item.url} target="_blank" rel="noreferrer" className="text-[color:var(--accent)] hover:underline">
                {item.title}
              </a>
            ) : (
              item.title
            )}
          </h3>
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{item.authors}</p>
          <p className="mt-1 text-xs md:text-sm text-gray-500">
            <span className="uppercase tracking-wide mr-2">{item.type}</span>
            <span>• {item.venue}</span>
            <span> • {item.year}</span>
          </p>
          {item.tags?.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {item.tags.map((t) => (
                <span key={t} className="inline-block rounded-full border px-2 py-0.5 text-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <div className="shrink-0 text-right">
          {item.artifacts?.length ? (
            <div className="flex flex-col gap-1">
              {item.artifacts.map((a) => (
                <a key={a.href} href={a.href} target="_blank" rel="noreferrer" className="text-xs text-[color:var(--accent)] hover:underline">
                  {a.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default PublicationCard;

