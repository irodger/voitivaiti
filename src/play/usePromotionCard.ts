import { useState } from 'react';
import { useI18n } from '../content/localization';
import { professionById } from '../content/professions';
import { promotionChecks } from '../world/mastery';
import { activeCharacter, activeTask, canPromote } from '../world/simulation';
import { useWorld } from '../world/store';
export function usePromotionCard(nodeId: string) {
    const w = useWorld();
    const ch = activeCharacter(w);
    const { t } = useI18n();
    const [open, setOpen] = useState(false);
    const node = professionById[ch.profession].careers.find(n => n.id === nodeId)!;
    const active = !!activeTask(w) && !activeTask(w)!.rewarded;
    const ready = canPromote(ch, nodeId) && !active;
    const checks = [...promotionChecks(ch, nodeId).map(check => ({ ...check, detail: check.met || check.key === 'promotion.warning' ? '' : `${check.current} / ${check.required}` })), { key: 'promotion.task', met: !active, detail: '' }];
    const promote = () => { w.dispatch({ type: 'promote', nodeId }); setOpen(false); };
    return { promote, w, t, open, setOpen, node, ready, checks };
}
