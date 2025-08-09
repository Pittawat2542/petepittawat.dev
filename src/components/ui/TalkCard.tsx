import React from 'react';

export type TalkResource = { label: string; href: string; download?: boolean };
export type Talk = {
  date: string; // ISO date
  title: string;
  audience: string;
  audienceUrl: string | null;
  mode: 'online' | 'on-site' | 'hybrid' | string;
  resources: TalkResource[];
  tags: string[];
};

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return iso;
  }
}

export function TalkCard({ item }: { item: Talk }) {
  return (
    <article className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{formatDate(item.date)}</span>
          <span className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400">{item.mode}</span>
        </div>
        <h3 className="text-base md:text-lg font-semibold leading-snug">{item.title}</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {item.audienceUrl ? (
            <a href={item.audienceUrl} target="_blank" rel="noreferrer" className="text-[color:var(--accent)] hover:underline">
              {item.audience}
            </a>
          ) : (
            item.audience
          )}
        </p>
        {item.tags?.length ? (
          <div className="mt-1 flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <span key={t} className="inline-block rounded-full border px-2 py-0.5 text-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                {t}
              </span>
            ))}
          </div>
        ) : null}
        {item.resources?.length ? (
          <div className="mt-2 flex flex-wrap gap-3">
            {item.resources.map((r) => (
              <a
                key={r.href}
                href={r.href}
                {...(r.download ? { download: '' } : {})}
                className="text-sm text-[color:var(--accent)] hover:underline"
                target={r.href.startsWith('http') ? '_blank' : undefined}
                rel={r.href.startsWith('http') ? 'noreferrer' : undefined}
              >
                {r.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default TalkCard;

