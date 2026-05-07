export interface TocHeadingInput {
  id: string;
  text: string;
  level: number;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
  depth: 'main' | 'sub';
}

export interface TocHeadingPosition {
  id: string;
  top: number;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function ensureUniqueId(baseId: string, usedIds: Set<string>) {
  const normalizedBase = baseId || 'section';

  if (!usedIds.has(normalizedBase)) {
    usedIds.add(normalizedBase);
    return normalizedBase;
  }

  let suffix = 2;
  let candidate = `${normalizedBase}-${suffix}`;
  while (usedIds.has(candidate)) {
    suffix += 1;
    candidate = `${normalizedBase}-${suffix}`;
  }

  usedIds.add(candidate);
  return candidate;
}

export function buildTocItems(headings: readonly TocHeadingInput[]): TocItem[] {
  const usedIds = new Set<string>();

  return headings.flatMap(heading => {
    const text = heading.text.trim();
    if (!text) {
      return [];
    }

    const preferredId = (heading.id || slugifyHeading(text)).trim();
    const id = ensureUniqueId(preferredId, usedIds);

    return [
      {
        id,
        text,
        level: heading.level,
        depth: heading.level === 2 ? 'main' : 'sub',
      },
    ];
  });
}

export function getActiveHeadingId(
  headings: readonly TocHeadingPosition[],
  offsetFromTop = 0
): string | null {
  if (!headings.length) {
    return null;
  }

  let activeId = headings[0]?.id ?? null;

  for (const heading of headings) {
    if (heading.top <= offsetFromTop) {
      activeId = heading.id;
      continue;
    }

    break;
  }

  return activeId;
}
