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
  const { query, setQuery, active, matches: matchesText } = useTextSearch();
  useEffect(() => {
    setSourceIndex(null);
    setQuery('');
  }, [app, task.id]);
  const selected =
    sourceIndex === null
      ? evidence.sources.length - 1
      : Math.min(sourceIndex, evidence.sources.length - 1);
  const matches = (keys: string[]) => matchesText(keys.map((key) => t(key)));
  const visibleNotes = evidence.notes.filter((key) => matches([key]));
  const visibleRecords = evidence.records.filter(({ row, title }) =>
    matches([title, row.labelKey, row.detailKey ?? '']),
  );
  const visibleMessages =
    app === 'chat' ? evidence.completed.filter((s) => matches([s.titleKey, s.bodyKey])) : [];
  const visibleSources = evidence.sources
    .map((code, index) => ({ code, index }))
    .filter((x) => matchesText([x.code]));
  const empty =
    evidence.notes.length === 0 && evidence.records.length === 0 && evidence.sources.length === 0;
  return {
    ...evidence,
    query,
    setQuery,
    setSourceIndex,
    visibleNotes,
    visibleRecords,
    visibleMessages,
    visibleSources,
    displayedSource: visibleSources.find((x) => x.index === selected) ?? visibleSources[0],
    empty,
    hasEvidence: !empty || (app === 'chat' && evidence.completed.length > 0),
    noMatches:
      active &&
      !visibleNotes.length &&
      !visibleRecords.length &&
      !visibleMessages.length &&
      (!(app === 'ide' || app === 'console') || !visibleSources.length),
  };
}
export type AppEvidenceModel = ReturnType<typeof useAppEvidence>;
