import { it, expect, vi } from 'vitest';
vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} });
import { transition } from '../world/engine';
import { emptyCampaign, activeCharacter } from '../world/simulation';
import { advanceCalendar } from '../world/life';
import { mailWorkTarget } from './mailWorkTarget';
import type { Task } from '../world/types';
it('routes only the same hero and project, and preserves waiting/results after reload without mutation', () => {
  const c = transition(emptyCampaign(), {
    type: 'new',
    name: 'Mail',
    avatarId: '1',
    professionId: 'frontend',
    seed: 1427,
  }).campaign;
  delete activeCharacter(c).firstDay;
  while (c.life!.calendarDay < c.company!.structure!.campaign.plannedDay) advanceCalendar(c);
  const mail = c.company!.mail!.messages[0],
    problem = c.company!.projects[0].problems.find((p) => p.id === mail.problemId)!;
  c.phase = 'office';
  c.activeTaskId = null;
  const task = {
    id: 'related',
    projectId: mail.projectId,
    problemId: mail.problemId,
    characterId: c.activeCharacterId,
    rewarded: false,
    paused: true,
  } as Task;
  c.tasks.push(task);
  expect(mailWorkTarget(c, mail)).toMatchObject({ canOpen: true, state: 'active', related: task });
  const other = { ...task, id: 'other', problemId: 'other', paused: false };
  c.tasks.push(other);
  c.activeTaskId = other.id;
  expect(mailWorkTarget(c, mail)).toMatchObject({ canOpen: false, state: 'busy' });
  c.activeTaskId = null;
  c.phase = 'home';
  expect(mailWorkTarget(c, mail).state).toBe('offDuty');
  c.phase = 'office';
  task.rewarded = true;
  mail.taskId = task.id;
  task.outcome = {
    kind: 'temporary',
    summaryKey: 'saved.result',
    followupKey: 'later',
    contribution: 'bounded',
    delayDays: 2,
  };
  problem.consequences = [
    {
      id: 'pending',
      actorId: c.activeCharacterId,
      dueDay: 99,
      outcome: task.outcome,
      resolved: false,
    },
  ];
  const before = JSON.stringify(c);
  expect(mailWorkTarget(c, mail)).toMatchObject({ state: 'waiting', previous: task });
  expect(JSON.stringify(c)).toBe(before);
  const loaded = JSON.parse(before);
  expect(mailWorkTarget(loaded, loaded.company.mail.messages[0])).toEqual(mailWorkTarget(c, mail));
  problem.consequences[0].resolved = true;
  problem.status = 'resolved';
  expect(mailWorkTarget(c, mail).state).toBe('completed');
  c.tasks.push({ ...task, id: 'wrong-project', projectId: 'elsewhere', rewarded: false });
  expect(mailWorkTarget(c, mail).related).toBeUndefined();
  c.tasks.push({ ...task, id: 'wrong-hero', characterId: 'elsewhere', rewarded: false });
  expect(mailWorkTarget(c, mail).related).toBeUndefined();
});
