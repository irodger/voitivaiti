import type { ReactNode } from 'react';
/** Simple section buttons; intentionally not ARIA tabs without tabpanel semantics. */
export function SectionTabs<Id extends string>({ items, value, onChange, className = 'home-tabs' }: {
    items: readonly {
        id: Id;
        label: ReactNode;
    }[];
    value: Id;
    onChange: (id: Id) => void;
    className?: string;
}) {
    return <div className={className}>{items.map(item => <button key={item.id} className={value === item.id ? 'active' : ''} aria-pressed={value === item.id} onClick={() => onChange(item.id)}>{item.label}</button>)}</div>;
}
