import { editorEvidence } from './editorEvidence';
import type { EditorKind } from '../content/laptopTools';
import { resolveTaskTemplate } from '../content/scenarios';
import type { AppId, Task } from '../world/types';
const kinds: Record<AppId, string[]> = {
  ide: ['code', 'component'],
  browser: ['network', 'design', 'environment'],
  console: ['metrics', 'logs'],
  chat: ['task'],
};
/** The reference apps can only display evidence the player has actually collected. */
export function collectAppEvidence(task: Task, app: AppId, editorKind: EditorKind = 'code') {
  const profile = editorEvidence[editorKind],
    professional = app === 'ide' && editorKind !== 'code';
  const accepted = professional ? [...kinds.ide, ...profile.kinds] : kinds[app];
  const template = resolveTaskTemplate(task),
    step = template.steps.find((s) => s.id === task.currentStepId)!;
  const relevant = template.steps.filter(
    (s) =>
      s.app === app ||
      (professional &&
        (profile.stepTypes.includes(s.type) ||
          s.actionFlow?.actions.some(
            (a) => a.artifact && profile.kinds.includes(a.artifact.kind),
          ))),
  );
  const notes = relevant.flatMap((s) => [
    ...Object.values(task.progress[s.id]?.observations ?? {}),
    ...(s.items ?? [])
      .filter((item) => task.progress[s.id]?.draft?.includes(item.id))
      .map((item) => item.detailKey ?? item.labelKey),
  ]);
  const sources = relevant
    .filter((s) => task.progress[s.id]?.status === 'completed' && !!s.code)
    .map((s) => s.code!)
    .concat(
      relevant.flatMap((s) =>
        (task.progress[s.id]?.actionHistory ?? [])
          .map((id) => s.actionFlow?.actions.find((a) => a.id === id)?.code)
          .filter((code): code is string => !!code),
      ),
    );
  const records = template.steps.flatMap((s) =>
    (s.actionFlow?.actions ?? []).flatMap((a) =>
      a.artifact && accepted.includes(a.artifact.kind)
        ? a.artifact.rows
            .filter((r) => task.progress[s.id]?.artifactReadings?.[a.id]?.includes(r.id))
            .map((row) => ({ row, kind: a.artifact!.kind, title: a.artifact!.titleKey }))
        : [],
    ),
  );
  const completed = relevant.filter((s) => task.progress[s.id]?.status === 'completed');
  return { template, step, relevant, notes, sources, records, completed };
}

export type AppEvidence = ReturnType<typeof collectAppEvidence>;
export function appEvidenceAvailability(
  e: Pick<AppEvidence, 'notes' | 'records' | 'sources' | 'completed'>,
  app: AppId,
) {
  const empty = e.notes.length === 0 && e.records.length === 0 && e.sources.length === 0;
  return { empty, hasEvidence: !empty || (app === 'chat' && e.completed.length > 0) };
}
export function appHasEvidence(task: Task, app: AppId, editorKind: EditorKind = 'code') {
  return appEvidenceAvailability(collectAppEvidence(task, app, editorKind), app).hasEvidence;
}
