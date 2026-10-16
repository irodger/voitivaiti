import { useId, useLayoutEffect, useRef, useState } from 'react';
import { useI18n } from '../content/localization';
import { glossary } from '../content/world';
import { usePopoverDismissal } from '../hooks/usePopoverDismissal';
import { popoverPosition } from '../utils/popoverPosition';
import { useWorld } from '../world/store';
export function useInlineTerm(id: string, context: string) {
    const w = useWorld();
    const { t } = useI18n();
    const [open, setOpen] = useState(false);
    const anchor = useRef<HTMLButtonElement>(null);
    const popup = useRef<HTMLSpanElement>(null);
    const tooltipId = useId();
    const term = glossary.find(g => g.id === id)!;
    const known = w.characters.find(c => c.id === w.activeCharacterId)?.discoveredTerms.includes(id);
    useLayoutEffect(() => { if (!open || !popup.current || !anchor.current)
        return; const node = popup.current; node.showPopover(); const rect = anchor.current.getBoundingClientRect(); const height = node.getBoundingClientRect().height; const position = popoverPosition(rect, { width: node.offsetWidth, height }, { width: innerWidth, height: innerHeight }); node.style.left = position.left + 'px'; node.style.top = position.top + 'px'; return () => { if (node.matches(':popover-open'))
        node.hidePopover(); }; }, [open]);
    usePopoverDismissal({ open, setOpen, anchor, popup });
    const toggle = () => { if (!open)
        w.dispatch({ type: 'discover-term', id, context }); setOpen(!open); };
    const close = () => setOpen(false);
    return { toggle, close, w, t, open, setOpen, anchor, popup, tooltipId, term, known };
}
