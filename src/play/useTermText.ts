import { useI18n } from '../content/localization';
import { glossary } from '../content/world';
const aliases: Record<string, string[]> = {
  mr: ['Merge Request', 'MR'],
  review: ['Code Review', 'review', 'ревью'],
  daily: ['Daily', 'daily', 'дейлик', 'дейли'],
  qa: ['QA'],
  frontend: ['Frontend'],
  bug: ['Bug', 'bug', 'баг'],
  variable: ['CSS variable'],
  null: ['null'],
  lead: ['Lead'],
  backend: ['Backend'],
  idempotency: ['идемпотентность', 'идемпотентности', 'idempotency'],
};
export function useTermText(children: string) {
  const { t } = useI18n();
  const candidates = glossary
    .flatMap((g) => (aliases[g.id] ?? [t(g.titleKey)]).map((word) => ({ word, id: g.id })))
    .sort((a, b) => b.word.length - a.word.length);
  const escaped = candidates.map((c) => c.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(
    '(?<![\\p{L}\\p{N}_])(' + escaped.join('|') + ')(?![\\p{L}\\p{N}_])',
    'giu',
  );
  const segments = children.split(pattern).map((label) => ({
    label,
    id: candidates.find((c) => c.word.toLowerCase() === label.toLowerCase())?.id,
  }));
  return { segments };
}
