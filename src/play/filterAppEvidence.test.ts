import { expect, it } from 'vitest';
import { filterAppEvidence } from './filterAppEvidence';
import { appEvidenceAvailability, type AppEvidence } from './appEvidence';
import { templates } from '../content/scenarios';
const base = (): AppEvidence => ({
  template: templates[0],
  step: templates[0].steps[0],
  relevant: [],
  notes: ['note'],
  sources: ['const First = 1;', 'const Latest = 2;'],
  records: [
    { kind: 'code', title: 'title', row: { id: 'row', labelKey: 'label', detailKey: 'detail' } },
  ],
  completed: [{ ...templates[0].steps[0], titleKey: 'message', bodyKey: 'body' }],
});
const labels: Record<string, string> = {
  note: 'Ошибка оплаты',
  title: 'Запрос',
  label: 'Ответ',
  detail: 'Детали',
  message: 'Обсуждение',
  body: 'Результат',
};
const t = (key: string) => labels[key] ?? key;
it('filters translated evidence by normalized literal query without mutating discovery or identity', () => {
  const evidence = base(),
    before = JSON.stringify(evidence);
  const result = filterAppEvidence(evidence, 'ide', '  ОПЛАТЫ  ', null, t);
  expect(result.visibleNotes).toEqual(['note']);
  expect(result.visibleRecords).toEqual([]);
  expect(result.noMatches).toBe(false);
  expect(result.hasEvidence).toBe(true);
  expect(JSON.stringify(evidence)).toBe(before);
  const records = filterAppEvidence(evidence, 'browser', 'детали', null, t);
  expect(records.visibleRecords[0]).toBe(evidence.records[0]);
});
it('defaults to the latest source, clamps stale selection and falls back to a matching source', () => {
  const e = base();
  expect(filterAppEvidence(e, 'ide', '', null, t).displayedSource?.index).toBe(1);
  expect(filterAppEvidence(e, 'ide', '', 99, t).displayedSource?.index).toBe(1);
  const found = filterAppEvidence(e, 'ide', 'FIRST', 1, t);
  expect(found.displayedSource).toEqual({ index: 0, code: e.sources[0] });
  expect(found.visibleSources.map((x) => x.index)).toEqual([0]);
  expect(found.noMatches).toBe(false);
});
it('counts source matches only in editor/console and never exposes completed chat answers elsewhere', () => {
  const e = base();
  expect(filterAppEvidence(e, 'console', 'first', null, t).noMatches).toBe(false);
  expect(filterAppEvidence(e, 'browser', 'first', null, t).noMatches).toBe(true);
  expect(filterAppEvidence(e, 'ide', 'обсуждение', null, t).visibleMessages).toEqual([]);
  expect(filterAppEvidence(e, 'chat', 'результат', null, t).visibleMessages).toEqual(e.completed);
});
it('distinguishes empty evidence, a completed chat message and a nonempty query with no matches', () => {
  const e = { ...base(), notes: [], records: [], sources: [] };
  expect(appEvidenceAvailability(e, 'chat')).toEqual({ empty: true, hasEvidence: true });
  expect(appEvidenceAvailability(e, 'ide')).toEqual({ empty: true, hasEvidence: false });
  const noSources = filterAppEvidence(e, 'ide', 'missing', 0, t);
  expect(noSources.displayedSource).toBeUndefined();
  expect(noSources.noMatches).toBe(true);
  expect(filterAppEvidence(e, 'ide', '  ', null, t).noMatches).toBe(false);
});
