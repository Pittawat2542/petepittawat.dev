import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveVisibleItemCount } from './cardOverflow.ts';

test('resolveVisibleItemCount leaves room for a stable overflow control', () => {
  assert.equal(resolveVisibleItemCount(5, 3), 2);
  assert.equal(resolveVisibleItemCount(3, 3), 3);
  assert.equal(resolveVisibleItemCount(2, 2), 2);
  assert.equal(resolveVisibleItemCount(4, 1), 1);
});
