import type { AboutTimelineItem } from './content';

export type SortableAboutTimelineItem = Pick<AboutTimelineItem, 'startYear' | 'startMonth'>;

export function compareAboutTimelineItems(
  left: SortableAboutTimelineItem,
  right: SortableAboutTimelineItem
) {
  const yearDelta = right.startYear - left.startYear;
  if (yearDelta !== 0) {
    return yearDelta;
  }

  return (right.startMonth ?? 12) - (left.startMonth ?? 12);
}

export function sortAboutTimelineItems<T extends SortableAboutTimelineItem>(items: readonly T[]) {
  return [...items].sort(compareAboutTimelineItems);
}
