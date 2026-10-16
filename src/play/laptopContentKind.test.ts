import { it, expect } from 'vitest';
import { laptopContentKind, type LaptopLocation } from './laptopContentKind';
import type { Step, Task } from '../world/types';
const step = { id: 'investigate', app: 'browser' } as Step;
const task = { status: 'active', rewarded: false } as Task;
const location: LaptopLocation = { board: false, app: 'browser', view: null };
it('keeps mail accessible during pending reward and otherwise shows the reward before the desk', () => {
  const delivered = { ...task, rewarded: true };
  expect(laptopContentKind({ ...location, app: 'mail' }, 'reward', delivered, step)).toBe('mail');
  expect(laptopContentKind({ ...location, board: true }, 'reward', delivered, step)).toBe('reward');
  expect(laptopContentKind({ ...location, board: true }, 'office', task, step)).toBe('desk');
});
it('separates empty, active and reference applications without changing task state', () => {
  const before = JSON.stringify(task);
  expect(laptopContentKind(location, 'office')).toBe('empty');
  expect(laptopContentKind(location, 'office', task, step)).toBe('step');
  expect(laptopContentKind({ ...location, app: 'console' }, 'office', task, step)).toBe(
    'reference',
  );
  expect(JSON.stringify(task)).toBe(before);
});
it('keeps a blocked task blocked even when a historical step is selected', () => {
  expect(
    laptopContentKind({ ...location, view: step }, 'office', { ...task, status: 'blocked' }, step),
  ).toBe('blocked');
  expect(laptopContentKind({ ...location, view: step }, 'office', task, step)).toBe('history');
});
it('allows archived steps after delivery while keeping the normal finished app read-only', () => {
  const delivered = { ...task, rewarded: true };
  expect(laptopContentKind(location, 'office', delivered, step)).toBe('finished');
  expect(laptopContentKind({ ...location, view: step }, 'office', delivered, step)).toBe('history');
});
