import { beforeEach, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const world = vi.hoisted(() => ({ phase: 'office', dispatch: vi.fn() }));
vi.mock('../world/store', () => ({
  useWorld: Object.assign(() => world, { getState: () => world }),
}));
vi.mock('../content/localization', () => ({ useI18n: () => ({ t: (key: string) => key }) }));
vi.mock('../world/workClock', () => ({ workClock: () => ({ remaining: 0, canFinish: true }) }));
import { useWorkClock } from './useWorkClock';
let model: ReturnType<typeof useWorkClock>;
const onFinish = vi.fn();
function Probe() {
  model = useWorkClock(onFinish);
  return null;
}
beforeEach(() => {
  world.phase = 'office';
  vi.resetAllMocks();
});
it('notifies the owner only after end-day actually transitions to home', () => {
  world.dispatch.mockImplementation(() => {
    world.phase = 'home';
  });
  renderToStaticMarkup(createElement(Probe));
  onFinish.mockImplementation(() => expect(world.phase).toBe('home'));
  model!.finish();
  expect(world.dispatch).toHaveBeenCalledWith({ type: 'end-day' });
  expect(onFinish).toHaveBeenCalledOnce();
});
it('keeps the laptop open when end-day is rejected and hides the clock outside office', () => {
  renderToStaticMarkup(createElement(Probe));
  model!.finish();
  expect(onFinish).not.toHaveBeenCalled();
  world.phase = 'home';
  renderToStaticMarkup(createElement(Probe));
  expect(model).toBeNull();
});
