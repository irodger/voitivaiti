import { useState } from 'react';
import { useI18n } from '../content/localization';
import { useWorld } from '../world/store';
import type { Project } from '../world/types';
export type OfficeWorkspaceProps = {
    project: Project;
    laptopOpen: boolean;
    openLaptop: () => void;
    openCompany: () => void;
};
export function useOfficeWorkspace() {
    const w = useWorld();
    const { t } = useI18n();
    const [contact, setContact] = useState<{
        id: string;
        topic?: string;
    } | null>(null);
    return { w, t, contact, setContact };
}
