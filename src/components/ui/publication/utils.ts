import type { Artifact, Publication } from '../../../types';

export function toTitleCase(input?: string) {
  if (!input) return '';
  return input.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1));
}

export function typeAccentVar(type?: string) {
  const key = (type ?? '').toLowerCase();
  switch (key) {
    case 'journal':
      return 'var(--accent-publications)';
    case 'conference':
      return 'var(--accent-talks)';
    case 'workshop':
      return 'var(--accent-projects)';
    case 'preprint':
    case 'arxiv':
      return 'var(--accent-research)';
    case 'poster':
      return 'var(--accent-about)';
    case 'demo':
      return 'var(--accent-2)';
    default:
      return 'var(--accent-publications)';
  }
}

export function renderAuthorsBold(authors: string) {
  // This function will be used by components, returning the processed data
  try {
    const normalized = authors
      .replace(/\s+(and)\s+/gi, ', ')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const isOwner = (name: string) => {
      const lower = name.toLowerCase();
      return lower.includes('pittawat') || lower.includes('taveekitworachai');
    };

    return normalized.map((name, idx) => ({
      name,
      isOwner: isOwner(name),
      isLast: idx === normalized.length - 1,
    }));
  } catch {
    // Fallback to highlightAuthorNames if available
    return [{ name: authors, isOwner: false, isLast: true }];
  }
}

export function deduplicateArtifacts(item: Publication) {
  const arr = Array.isArray(item.artifacts) ? item.artifacts : [];
  const seen = new Set<string>();
  const cleaned: NonNullable<typeof item.artifacts> = [];

  for (const a of arr) {
    if (!a || !a.href) continue;
    if (item.url && a.href === item.url) continue;
    if (seen.has(a.href)) continue;
    seen.add(a.href);
    // Cast to mutable array type to allow push
    (cleaned as Artifact[]).push(a);
  }

  return cleaned;
}
