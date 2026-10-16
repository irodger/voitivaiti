/** Normalize only the query; whitespace inside searchable values remains meaningful. */
export function textSearch(query: string) {
  const normalized = query.trim().toLocaleLowerCase();
  return {
    active: !!normalized,
    matches: (values: readonly string[]) =>
      !normalized || values.join(' ').toLocaleLowerCase().includes(normalized),
  };
}
