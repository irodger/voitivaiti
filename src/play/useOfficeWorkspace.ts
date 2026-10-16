import { useAppUI } from '../app/uiStore';
import { useAppActions } from '../hooks/useAppActions';
import { useState } from 'react';
import { useI18n } from '../content/localization';
import { useWorld } from '../world/store';
import type { Project } from '../world/types';
export type OfficeWorkspaceProps = {
  project: Project;
};
export function useOfficeWorkspace() {
  const laptopOpen = useAppUI((s) => s.laptop);
  const { openLaptop, openCompany } = useAppActions();
  const w = useWorld();
  const { t } = useI18n();
  const [contact, setContact] = useState<{
    id: string;
    topic?: string;
  } | null>(null);
  return { laptopOpen, openLaptop, openCompany, w, t, contact, setContact };
}
