import { useState } from 'react';
import { textSearch } from '../utils/textSearch';
/** Query state shared by searchable views; translated values are supplied on each render. */
export function useTextSearch() {
  const [query, setQuery] = useState('');
  return { query, setQuery, ...textSearch(query) };
}
