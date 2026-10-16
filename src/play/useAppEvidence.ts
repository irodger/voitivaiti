import { filterAppEvidence } from './filterAppEvidence';
import { useTextSearch } from '../hooks/useTextSearch';
import type { EditorKind } from '../content/laptopTools';
import { useEffect, useState } from 'react';
import { collectAppEvidence } from './appEvidence';
import { useI18n } from '../content/localization';
import type { AppId, Task } from '../world/types';
/** Local search and fragment selection never mutate task evidence. */
export function useAppEvidence(task: Task, app: AppId, editorKind: EditorKind = 'code') {
  const evidence = collectAppEvidence(task, app, editorKind);
  const { t } = useI18n();
  const [sourceIndex, setSourceIndex] = useState<number | null>(null);
  const { query, setQuery } = useTextSearch();
  useEffect(() => {
    setSourceIndex(null);
    setQuery('');
  }, [app, task.id]);
  return {
    ...evidence,
    query,
    setQuery,
    setSourceIndex,
    ...filterAppEvidence(evidence, app, query, sourceIndex, t),
  };
}
export type AppEvidenceModel = ReturnType<typeof useAppEvidence>;
