const WORDS_PER_MINUTE = 220;

const WORD_SEGMENTER = new Intl.Segmenter(undefined, {
  granularity: 'word',
});

function normalizeReadingSource(source: string): string {
  return source
    .replace(/\r\n?/g, '\n')
    .replace(/^\s*(import|export)\s.+$/gm, ' ')
    .replace(/^(```|~~~).*$|^---$/gm, ' ')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[>\-+*]\s+/gm, '')
    .replace(/<\/?(?:[A-Z][\w.-]*|[a-z][a-z0-9-]*)(?:\s[^>]*)?\s*\/?>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface ReadingMetrics {
  wordCount: number;
  readingTimeMin: number;
}

export function estimateReadingMetrics(source: string): ReadingMetrics {
  const normalized = normalizeReadingSource(source);

  if (!normalized) {
    return {
      wordCount: 0,
      readingTimeMin: 1,
    };
  }

  const wordCount = Array.from(WORD_SEGMENTER.segment(normalized)).filter(
    segment => segment.isWordLike
  ).length;

  return {
    wordCount,
    readingTimeMin: Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE)),
  };
}
