import { useMediaQuery } from '../hooks/useMediaQuery';
import { gameConfig } from '../config/game';
import { createContext, useContext, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import './actionDock.css';
const DockContext = createContext<HTMLElement | null>(null);
/** A panel owns its action slot; actions outside a panel remain in document flow. */
export function ActionPanel({ children, className, desktopOnly = false }: {
    children: ReactNode;
    className: string;
    desktopOnly?: boolean;
}) {
    const [slot, setSlot] = useState<HTMLDivElement | null>(null), wide = useMediaQuery(gameConfig.ui.desktopQuery);
    return <DockContext.Provider value={desktopOnly && !wide ? null : slot}><section className={className}>{children}<div className="panel-action-slot" ref={setSlot}/></section></DockContext.Provider>;
}
export function ActionDock({ children, active = true }: {
    children: ReactNode;
    active?: boolean;
}) {
    const slot = useContext(DockContext);
    return active && slot ? createPortal(<div className="panel-action-dock">{children}</div>, slot) : <>{children}</>;
}
