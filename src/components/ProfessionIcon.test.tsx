import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ProfessionIcon, professionEmblems } from './ProfessionIcon';
import { professions } from '../content/professions';

it('gives every playable profession a distinct symbol', () => {
  expect(Object.keys(professionEmblems).sort()).toEqual(professions.map((p) => p.id).sort());
  expect(new Set(Object.values(professionEmblems).map((e) => e.Symbol)).size).toBe(
    professions.length,
  );
});

it('keeps gradient references unique and resolved when all profession icons share a page', () => {
  const html = renderToStaticMarkup(
    <>
      {professions.map((p) => (
        <ProfessionIcon key={p.id} profession={p.id} />
      ))}
    </>,
  );
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  const references = [...html.matchAll(/url\(#([^)]+)\)/g)].map((m) => m[1]);
  expect(ids.length).toBe(professions.length * 2);
  expect(new Set(ids).size).toBe(ids.length);
  for (const reference of references) expect(ids).toContain(reference);
  expect(html.match(/<span class="profession-icon"[^>]*aria-hidden="true"/g)).toHaveLength(
    professions.length,
  );
});
