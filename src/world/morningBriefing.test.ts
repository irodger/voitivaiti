import { it, expect, vi } from 'vitest';
vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} });
import { beginPlaytest } from './playtestHelpers';
import { activeCharacter, makeTask } from './simulation';
import { captureDayReport } from './dayReport';
import { morningBriefing } from './morningBriefing';
import { addWorkdays } from './calendar';

function pending() {
  const c = beginPlaytest('frontend'),
    task = makeTask(c);
  c.tasks.push(task);
  task.paused = true;
  c.activeTaskId = null;
  task.progress[task.currentStepId].dependency = {
    npcId: 'owner',
    dueDay: c.life!.calendarDay,
    dueMinute: 900,
    ready: false,
  };
  c.life!.dayReport = captureDayReport(c);
  c.life!.calendarDay = addWorkdays(c.life!.calendarDay, 1);
  c.phase = 'office';
  return { c, task };
}
it('distinguishes a real ready reply from a still-waiting request and is stable after serialization', () => {
  const { c, task } = pending();
  expect(morningBriefing(c)!.items[0].kind).toBe('waiting');
  task.progress[task.currentStepId].dependency!.ready = true;
  const before = JSON.stringify(c);
  expect(morningBriefing(c)!.items[0]).toMatchObject({ taskId: task.id, kind: 'ready' });
  expect(morningBriefing(JSON.parse(before))).toEqual(morningBriefing(c));
  expect(JSON.stringify(c)).toBe(before);
});
it('uses current agreed deadlines, including weekend advances, without carrying stale promises', () => {
  const { c } = pending(),
    q = c.life!.queue.find((q) => q.id === 'bug')!;
  q.status = 'waiting';
  q.expectation = { state: 'waiting', dueDay: c.life!.calendarDay };
  expect(morningBriefing(c)!.deadlines).toContainEqual(
    expect.objectContaining({ id: 'bug', overdue: false }),
  );
  q.expectation.dueDay = addWorkdays(c.life!.calendarDay, 2);
  expect(morningBriefing(c)!.deadlines.some((d) => d.id === 'bug')).toBe(false);
  q.expectation.dueDay = c.life!.calendarDay - 1;
  expect(morningBriefing(c)!.deadlines).toContainEqual(
    expect.objectContaining({ id: 'bug', overdue: true }),
  );
  q.delegatedTo = 'owner';
  expect(morningBriefing(c)!.deadlines.some((d) => d.id === 'bug')).toBe(false);
});
it('does not invent a previous day for old saves, another hero or another company', () => {
  const { c } = pending(),
    report = c.life!.dayReport!;
  delete c.life!.dayReport;
  expect(morningBriefing(c)).toBeUndefined();
  c.life!.dayReport = { ...report, characterId: 'other' };
  expect(morningBriefing(c)).toBeUndefined();
  c.life!.dayReport = { ...report, companyId: 'other' };
  expect(morningBriefing(c)).toBeUndefined();
  c.life!.dayReport = report;
  c.life!.calendarDay = report.calendarDay;
  expect(morningBriefing(c)).toBeUndefined();
  expect(activeCharacter(c).stats.xp).toBe(0);
});
