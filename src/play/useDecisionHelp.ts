import { useId, useLayoutEffect, useRef, useState } from 'react';
import { useI18n } from '../content/localization';
import { usePopoverDismissal } from '../hooks/usePopoverDismissal';
import { popoverPosition } from '../utils/popoverPosition';
export function useDecisionHelp() {
    const { t } = useI18n();
    const [open, setOpen] = useState(false);
    const id = useId();
    const trigger = useRef<HTMLButtonElement>(null);
    const popup = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => { if (!open)
        return; const node = popup.current!; node.showPopover(); const r = trigger.current!.getBoundingClientRect(); const height = node.offsetHeight; const position = popoverPosition(r, { width: node.offsetWidth, height }, { width: innerWidth, height: innerHeight }, 12); node.style.left = position.left + 'px'; node.style.top = position.top + 'px'; return () => { if (node.matches(':popover-open'))
        node.hidePopover(); }; }, [open]);
    usePopoverDismissal({ open, setOpen, anchor: trigger, popup, closeOnScroll: true, stopImmediateEscape: true });
    const toggle = () => setOpen(v => !v);
    return { toggle, t, open, setOpen, id, trigger, popup };
}
