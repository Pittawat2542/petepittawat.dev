import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveRowClampLineCounts } from './rowClamp.ts';

test('resolveRowClampLineCounts caps each visual row to its shortest description', () => {
  assert.deepEqual(
    resolveRowClampLineCounts([
      { top: 0, naturalLineCount: 4 },
      { top: 1, naturalLineCount: 2 },
      { top: 84, naturalLineCount: 3 },
      { top: 85, naturalLineCount: 5 },
    ]),
    [2, 2, 3, 3]
  );
});

test('resolveRowClampLineCounts preserves single-card rows', () => {
  assert.deepEqual(
    resolveRowClampLineCounts([
      { top: 0, naturalLineCount: 4 },
      { top: 90, naturalLineCount: 2 },
    ]),
    [4, 2]
  );
});
