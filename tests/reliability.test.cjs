const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { LocalStore } = require(path.join(process.env.LITSPARK_TEST_BUILD, 'localStore.js'));
const { defaultProgress, decodeProgress, decodeProfile, completeActivity } = require(path.join(process.env.LITSPARK_TEST_BUILD, 'learningState.js'));
const at = '2026-10-29T14:00:00.000Z';
function memory(initial = null) {
  return { raw: initial, writes: [], async getItem() { return this.raw; }, async setItem(key, value) { this.writes.push([key, value]); this.raw = value; } };
}
function deferred() { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; }

test('startup waits for existing data, blocks edits, and never saves defaults over it', async () => {
  const load = deferred();
  const saved = { ...defaultProgress, experiencePoints: 80 };
  const storage = memory(JSON.stringify(saved));
  storage.getItem = () => load.promise;
  const store = new LocalStore('userProgress', defaultProgress, decodeProgress, storage);
  const first = store.load();
  assert.equal(first, store.load(), 'overlapping loads share one request');
  await assert.rejects(store.update(value => ({ ...value, experiencePoints: 0 })));
  assert.equal(storage.writes.length, 0);
  assert.equal(store.getSnapshot().loaded, false);
  load.resolve(JSON.stringify(saved)); await first;
  assert.equal(store.getSnapshot().data.experiencePoints, 80);
  assert.equal(storage.writes.length, 0);
});

test('failed reads preserve saved bytes and can be retried', async () => {
  const storage = memory(JSON.stringify({ ...defaultProgress, experiencePoints: 42 }));
  let attempts = 0;
  storage.getItem = async () => { if (++attempts === 1) throw Error('Storage busy'); return storage.raw; };
  const store = new LocalStore('userProgress', defaultProgress, decodeProgress, storage);
  await store.load();
  assert.equal(store.getSnapshot().error, 'load');
  assert.equal(store.getSnapshot().loaded, false);
  assert.equal(storage.writes.length, 0);
  await store.retry();
  assert.equal(store.getSnapshot().data.experiencePoints, 42);
  assert.equal(store.getSnapshot().error, null);
});

test('malformed JSON and invalid saved shapes never trigger replacement writes', async () => {
  for (const raw of ['{broken', 'null', '[]', '"wrong"', '{"experiencePoints":-1}', '{"writingDrafts":{"ask-for-help":{"text":3}}}']) {
    const storage = memory(raw);
    const store = new LocalStore('userProgress', defaultProgress, decodeProgress, storage);
    await store.load();
    assert.equal(store.getSnapshot().error, 'load');
    assert.equal(storage.raw, raw); assert.equal(storage.writes.length, 0);
  }
});

test('older saved progress gains new fields while retaining existing totals', () => {
  const progress = decodeProgress({ totalMinutesSpoken: 25, experiencePoints: 123, averageScore: 80, scoreCount: 2, achievements: ['10_minutes'] });
  assert.equal(progress.experiencePoints, 123); assert.equal(progress.currentLevel, 3);
  assert.deepEqual(progress.completions, {}); assert.deepEqual(progress.writingDrafts, {});
  assert.deepEqual(progress.achievements, ['10_minutes']);
});

test('profile hydration retains edits and serializes fast typing in order', async () => {
  const writes = [];
  const storage = memory(JSON.stringify({ name: 'Maya', bio: 'Hello', joinDate: at }));
  const gate = deferred();
  storage.setItem = async (key, value) => { writes.push(value); if (writes.length === 1) await gate.promise; storage.raw = value; };
  const store = new LocalStore('userProfile', { name: 'New Learner', bio: '', joinDate: at }, decodeProfile, storage);
  await store.load();
  const a = store.update(current => ({ ...current, name: 'May' }));
  const b = store.update(current => ({ ...current, name: 'Maya Chen' }));
  await Promise.resolve();
  assert.equal(writes.length <= 1, true);
  assert.equal(store.getSnapshot().data.name, 'Maya Chen');
  gate.resolve(); await Promise.all([a, b]);
  assert.equal(JSON.parse(storage.raw).name, 'Maya Chen'); assert.equal(store.getSnapshot().dirty, false);
});

test('completion, score, and XP persist together and duplicate attempts are reward-free', async () => {
  const storage = memory(); const store = new LocalStore('userProgress', defaultProgress, decodeProgress, storage);
  await store.load();
  const finish = () => store.update(value => completeActivity(value, 'reading:1', 3, 4, 10, at));
  await Promise.all([finish(), finish(), finish()]);
  const saved = JSON.parse(storage.raw);
  assert.equal(saved.experiencePoints, 10); assert.equal(saved.scoreCount, 1); assert.equal(saved.averageScore, 75); assert.equal(saved.sessionsCompleted, 1);
  const reopened = new LocalStore('userProgress', defaultProgress, decodeProgress, storage); await reopened.load();
  await reopened.update(value => completeActivity(value, 'reading:1', 4, 4, 10, at));
  assert.equal(reopened.getSnapshot().data.experiencePoints, 10); assert.equal(reopened.getSnapshot().data.scoreCount, 1);
});

test('failed completion save keeps the result and retry never duplicates its reward', async () => {
  const storage = memory(); let failed = false;
  storage.setItem = async (_key, value) => { if (!failed) { failed = true; throw Error('disk full'); } storage.raw = value; };
  const store = new LocalStore('userProgress', defaultProgress, decodeProgress, storage); await store.load();
  const finish = () => store.update(value => completeActivity(value, 'module:small-talk', 8, 10, 8, at));
  await assert.rejects(finish());
  assert.equal(store.getSnapshot().dirty, true); assert.equal(store.getSnapshot().error, 'save');
  assert.equal(store.getSnapshot().data.experiencePoints, 8);
  await finish();
  assert.equal(store.getSnapshot().dirty, false); assert.equal(store.getSnapshot().error, null);
  assert.equal(JSON.parse(storage.raw).experiencePoints, 8);
});

test('one failed queued write does not prevent a newer write from saving', async () => {
  const storage = memory(); let attempt = 0;
  storage.setItem = async (_key, value) => { if (++attempt === 1) throw Error('temporary failure'); storage.raw = value; };
  const store = new LocalStore('userProgress', defaultProgress, decodeProgress, storage); await store.load();
  const a = store.update(value => ({ ...value, experiencePoints: 1 }));
  const b = store.update(value => ({ ...value, experiencePoints: 2 }));
  await assert.rejects(a); await b;
  assert.equal(JSON.parse(storage.raw).experiencePoints, 2); assert.equal(store.getSnapshot().error, null);
});

test('draft text including empty edits survives a new store instance', async () => {
  const storage = memory(); const store = new LocalStore('userProgress', defaultProgress, decodeProgress, storage); await store.load();
  await store.update(value => ({ ...value, writingDrafts: { 'ask-for-help': { text: 'Could you explain this?', updatedAt: at } } }));
  const reopened = new LocalStore('userProgress', defaultProgress, decodeProgress, storage); await reopened.load();
  assert.equal(reopened.getSnapshot().data.writingDrafts['ask-for-help'].text, 'Could you explain this?');
  await reopened.update(value => ({ ...value, writingDrafts: { 'ask-for-help': { text: '', updatedAt: at } } }));
  assert.equal(decodeProgress(JSON.parse(storage.raw)).writingDrafts['ask-for-help'].text, '');
});

test('invalid quiz totals and rewards do not change progress', () => {
  for (const [score, total, xp] of [[0, 0, 10], [11, 10, 10], [-1, 4, 10], [NaN, 10, 1], [2, 4, -1], [2, 4, Infinity]]) {
    assert.equal(completeActivity(defaultProgress, 'reading:1', score, total, xp, at), defaultProgress);
  }
});

test('different content IDs earn their own rewards while replay preserves the first result', () => {
  const first = completeActivity(defaultProgress, 'reading:1', 2, 4, 10, at);
  const second = completeActivity(first, 'module:1', 8, 10, 8, at);
  assert.equal(second.experiencePoints, 18); assert.equal(second.scoreCount, 2); assert.equal(second.averageScore, 65);
  assert.equal(completeActivity(second, 'module:1', 10, 10, 10, at), second);
});
