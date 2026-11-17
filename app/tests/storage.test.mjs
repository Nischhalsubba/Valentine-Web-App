import assert from 'node:assert/strict';
import test from 'node:test';
import { getJSON, resetAll } from '../src/utils/storage.ts';

function withStorage(storage, callback) {
  const previous = globalThis.window;
  globalThis.window = { localStorage: storage };
  try { callback(); } finally {
    if (previous === undefined) delete globalThis.window;
    else globalThis.window = previous;
  }
}

test('getJSON restores object defaults instead of accepting null or arrays', () => {
  let value = 'null';
  withStorage({ getItem: () => value }, () => {
    assert.deepEqual(getJSON('example', { gate: false }), { gate: false });
    value = '[]';
    assert.deepEqual(getJSON('example', { gate: false }), { gate: false });
    value = '{"gate":true}';
    assert.deepEqual(getJSON('example', { gate: false }), { gate: true });
    value = '"wrong type"';
    assert.equal(getJSON('example', 0), 0);
  });
});

test('resetAll handles denied storage and never clears unrelated keys', () => {
  withStorage({ removeItem: () => { throw new Error('storage denied'); } }, () => {
    assert.doesNotThrow(resetAll);
  });
  const removed = [];
  withStorage({ removeItem: (key) => removed.push(key) }, resetAll);
  assert.ok(removed.includes('mutu.progress.step'));
  assert.ok(removed.includes('mutu.unlocks'));
  assert.ok(!removed.includes('unrelated.key'));
});
