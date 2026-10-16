import { expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} });
// SSR reads Zustand's initial snapshot; bind this unit test to the selected locale.
vi.mock('../content/localization', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../content/localization')>();
  return { ...actual, useI18n: () => ({ t: actual.translate }) };
});
import { ProfessionPreview } from './ProfessionPreview';
import { professions } from '../content/professions';
import { professionDilemma } from '../content/professionExperience';
import { dictionary, usePreferences } from '../content/localization';

it('every profession presents its own dilemma and actual first task in both languages', () => {
  expect(Object.keys(professionDilemma).sort()).toEqual(professions.map((p) => p.id).sort());
  for (const locale of ['ru', 'en'] as const) {
    usePreferences.setState({ locale });
    const dilemmas = new Set<string>();
    for (const profession of professions) {
      const dilemma = dictionary[professionDilemma[profession.id]][locale];
      expect(dilemma.length).toBeGreaterThan(30);
      dilemmas.add(dilemma);
      const html = renderToStaticMarkup(<ProfessionPreview role={profession.id} />);
      expect(html).toContain(dictionary[profession.titleKey][locale]);
      expect(html).toContain(dilemma);
      expect(html).not.toContain('undefined');
    }
    expect(dilemmas.size).toBe(professions.length);
  }
});
