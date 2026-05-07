import assert from 'node:assert/strict';
import test from 'node:test';

import { sortAboutTimelineItems } from './about-timeline.ts';

test('sorts about timeline items by structured year and month descending', () => {
  const sorted = sortAboutTimelineItems([
    { startYear: 2024, startMonth: 10, label: 'Oct 2024' },
    { startYear: 2026, startMonth: 2, label: 'Feb 2026' },
    { startYear: 2025, label: '2025 milestone' },
    { startYear: 2024, startMonth: 9, label: 'Sep 2024' },
  ]);

  assert.deepEqual(
    sorted.map(item => item.label),
    ['Feb 2026', '2025 milestone', 'Oct 2024', 'Sep 2024']
  );
});
