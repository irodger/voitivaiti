import { useRef, useState } from 'react';
import { useI18n } from '../content/localization';
import { taskContext } from '../utils/taskContext';
import { useScrollReset } from '../hooks/useScrollReset';
import { activeCharacter, activeTask } from '../world/simulation';
import { useWorld } from '../world/store';
import type { DayEvent } from '../world/types';
export function useWork() {
  const w = useWorld();
  const ch = activeCharacter(w);
  const task = activeTask(w);
  const { template } = taskContext(task);
  const { t } = useI18n();
  const [eventId, setEventId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pending = w.schedule.filter((e) => e.status === 'pending');
  const event =
    pending.find((e) => e.type === 'sync') ??
    w.schedule.find((e) => e.id === eventId && e.status === 'pending') ??
    pending[0];
  useScrollReset(contentRef, [w.company?.currentDay, event?.id, w.phase].join(':'));
  const project =
    w.company!.projects.find((p) => p.id === task?.projectId) ?? w.company!.projects[0];
  const chooseEvent = (e: DayEvent) => {
    setEventId(e.id);
    if (e.type === 'survey') w.dispatch({ type: 'survey-open' });
  };
  const chooseOption = (id: string) => {
    if (event!.type === 'survey') w.dispatch({ type: 'survey-open' });
    w.dispatch({ type: 'event', id: event!.id, choiceId: id });
    setEventId(null);
  };
  return {
    chooseOption,
    w,
    ch,
    template,
    t,
    eventId,
    setEventId,
    contentRef,
    pending,
    event,
    project,
    chooseEvent,
  };
}
