import { describe, expect, it } from 'vitest';
import { textSearch } from './textSearch';
describe('shared text search', () => {
  it('treats blank queries as inactive and matches even empty values', () => {
    const search = textSearch('  ');
    expect(search.active).toBe(false);
    expect(search.matches([])).toBe(true);
  });
  it('normalizes query edges and Cyrillic case without changing interior whitespace', () => {
    const search = textSearch('  ПРИВЕТ МИР  ');
    expect(search.active).toBe(true);
    expect(search.matches(['привет', 'мир'])).toBe(true);
    expect(search.matches(['привет  мир'])).toBe(false);
  });
  it('matches joined display fields and treats regex symbols literally', () => {
    expect(textSearch('foo [bar]').matches(['Foo', '[Bar]'])).toBe(true);
    expect(textSearch('.*').matches(['anything'])).toBe(false);
  });
  it('can use freshly translated fields with the same query', () => {
    const search = textSearch('hello');
    expect(search.matches(['Привет'])).toBe(false);
    expect(search.matches(['Hello'])).toBe(true);
  });
});
