import { it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Task, Step } from '../world/types';
vi.mock('../content/localization', () => ({
  useI18n: () => ({ t: (key: string) => key }),
  text: () => {},
}));
vi.mock('./TermText', () => ({
  TermText: ({ children }: { children: string }) => <>{children}</>,
}));
import { ResultMaterials } from './ResultMaterials';
it('keeps future and unfinished observations out of the delivered record', () => {
  const task = {
    progress: {
      done: { status: 'completed', observations: { one: 'observed.fact', two: 'observed.fact' } },
      future: { status: 'locked', observations: { one: 'future.secret' } },
      active: { status: 'active', observations: { one: 'unfinished.fact' } },
    },
  } as unknown as Task;
  const steps = ['done', 'future', 'active'].map((id) => ({
    id,
    titleKey: 'step.' + id,
  })) as Step[];
  const before = JSON.stringify(task),
    html = renderToStaticMarkup(<ResultMaterials task={task} steps={steps} />);
  expect(html.match(/observed.fact/g)).toHaveLength(1);
  expect(html).not.toContain('future.secret');
  expect(html).not.toContain('unfinished.fact');
  expect(JSON.stringify(task)).toBe(before);
});
it('does not invent materials when there are no recorded observations', () => {
  const task = { progress: { done: { status: 'completed' } } } as unknown as Task;
  expect(
    renderToStaticMarkup(
      <ResultMaterials task={task} steps={[{ id: 'done', titleKey: 'step.done' } as Step]} />,
    ),
  ).toBe('');
});
