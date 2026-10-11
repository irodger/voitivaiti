import { useLayoutEffect, type RefObject } from 'react';

/** Start a work step at its brief, not at repeated workspace chrome above it. */
export function useWorkspaceScroll(ref: RefObject<HTMLElement | null>, key: string, stepId?: string) {
    useLayoutEffect(() => {
        const container = ref.current;
        if (!container) return;
        container.scrollTop = 0;
        if (!stepId) return;
        let frame = 0;
        const observer = new MutationObserver(align);
        function align() {
            const step = [...container!.querySelectorAll<HTMLElement>('.mechanic[data-step-id]')].find(node => node.dataset.stepId === stepId);
            if (!step) return;
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                frame = requestAnimationFrame(() => {
                    if (!step.isConnected) return;
                    observer.disconnect();
                    const heading = step.querySelector<HTMLElement>(':scope>h2') ?? step;
                    // Layout offsets do not shrink with the laptop's opening transform.
                    const layoutTop = (node: HTMLElement) => {
                        let top = 0;
                        for (let current: HTMLElement | null = node; current; current = current.offsetParent as HTMLElement | null) top += current.offsetTop;
                        return top;
                    };
                    container!.scrollTop = layoutTop(heading) - layoutTop(container!) - 10;
                });
            });
        }
        // AnimatePresence may mount the new step after the previous one exits.
        observer.observe(container, { childList: true, subtree: true });
        window.addEventListener('resize', align);
        align();
        return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('resize', align); };
    }, [ref, key, stepId]);
}
