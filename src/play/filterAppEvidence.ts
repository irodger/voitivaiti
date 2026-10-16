import { textSearch } from '../utils/textSearch';
import type { AppId } from '../world/types';
import { appEvidenceAvailability, type AppEvidence } from './appEvidence';
/** Filter collected evidence without changing discovery state or source identities. */
export function filterAppEvidence(
  evidence: AppEvidence,
  app: AppId,
  query: string,
  sourceIndex: number | null,
  t: (key: string) => string,
) {
  const { active, matches: matchesText } = textSearch(query);
  const { empty, hasEvidence } = appEvidenceAvailability(evidence, app);
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

  return {
    visibleNotes,
    visibleRecords,
    visibleMessages,
    visibleSources,
    displayedSource: visibleSources.find((x) => x.index === selected) ?? visibleSources[0],
    empty,
    hasEvidence,
    noMatches:
      active &&
      !visibleNotes.length &&
      !visibleRecords.length &&
      !visibleMessages.length &&
      (!(app === 'ide' || app === 'console') || !visibleSources.length),
  };
}
