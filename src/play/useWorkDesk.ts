import { Activity, Battery, ShieldCheck } from 'lucide-react';
import { useRef } from 'react';
import { useI18n } from '../content/localization';
import { deskAvailability } from '../world/deskAvailability';
import { activeCharacter, activeTask } from '../world/simulation';
import { useWorld } from '../world/store';
export function useWorkDesk() {
    const w = useWorld();
    const task = activeTask(w);
    const ch = activeCharacter(w);
    const { t } = useI18n();
    const deskRef = useRef<HTMLElement>(null);
    const scrollTo = (selector: string) => deskRef.current?.querySelector(selector)?.scrollIntoView({ block: 'nearest' });
    const stats = [{ id: 'energy' as const, Icon: Battery }, { id: 'stress' as const, Icon: Activity }, { id: 'reputation' as const, Icon: ShieldCheck }];
    const availability = deskAvailability(w);
    const current = task && !task.rewarded;
    const sync = w.schedule.find(e => e.type === 'sync' && e.status === 'pending');
    return { w, task, ch, t, deskRef, scrollTo, stats, availability, current, sync };
}
