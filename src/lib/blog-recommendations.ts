import type { BlogPost } from './content.ts';
import { getSeriesNavigation } from './series.ts';

export type SuggestedReadingMode = 'series-led' | 'topic-led';

export interface SuggestedReadingResult<TPost> {
  mode: SuggestedReadingMode;
  posts: TPost[];
}

type RecommendedPost = {
  id: string;
  data: {
    tags: string[];
    pubDate: Date;
    seriesSlug?: string | undefined;
    seriesTitle?: string | undefined;
    seriesOrder?: number | undefined;
  };
};

const DEFAULT_SUGGESTED_READING_COUNT = 2;

function getSharedTagCount(currentTags: string[], candidateTags: string[]) {
  if (!currentTags.length || !candidateTags.length) {
    return 0;
  }

  const currentTagSet = new Set(currentTags);
  return candidateTags.reduce((count, tag) => count + (currentTagSet.has(tag) ? 1 : 0), 0);
}

export function getSuggestedReading<TPost extends RecommendedPost>(
  posts: TPost[],
  currentPost: TPost,
  limit = DEFAULT_SUGGESTED_READING_COUNT
): SuggestedReadingResult<TPost> {
  const nextInSeries = getSeriesNavigation(
    posts as unknown as BlogPost[],
    currentPost as unknown as BlogPost
  )?.nextPost as TPost | undefined;

  const selectedIds = new Set<string>([currentPost.id]);
  const recommendations: TPost[] = [];

  if (nextInSeries) {
    selectedIds.add(nextInSeries.id);
    recommendations.push(nextInSeries);
  }

  const topicalMatches = posts
    .filter(candidate => !selectedIds.has(candidate.id))
    .map(candidate => ({
      candidate,
      sharedTagCount: getSharedTagCount(currentPost.data.tags, candidate.data.tags),
    }))
    .filter(entry => entry.sharedTagCount > 0)
    .sort((left, right) => {
      if (right.sharedTagCount !== left.sharedTagCount) {
        return right.sharedTagCount - left.sharedTagCount;
      }

      return right.candidate.data.pubDate.valueOf() - left.candidate.data.pubDate.valueOf();
    })
    .map(entry => entry.candidate);

  for (const candidate of topicalMatches) {
    if (recommendations.length >= limit) {
      break;
    }

    recommendations.push(candidate);
  }

  return {
    mode: nextInSeries ? 'series-led' : 'topic-led',
    posts: recommendations.slice(0, limit),
  };
}
