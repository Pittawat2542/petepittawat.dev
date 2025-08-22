export function slugifyTag(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function createTagSlugMap(tags: string[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const t of tags) {
    map[slugifyTag(t)] = t;
  }
  return map;
}

