import { useState } from 'react';
import { useI18n } from '../content/localization';
import { professionById } from '../content/professions';
import { activeCharacter } from '../world/simulation';
import { useWorld } from '../world/store';
import { careerLayout } from './careerLayout';
export function useCareerMap() {
  const w = useWorld();
  const ch = activeCharacter(w);
  const role = professionById[ch.profession];
  const { t } = useI18n();
  const [selected, setSelected] = useState<string | null>(null);
  const { columns, points } = careerLayout(role.careers, ch.careerNodeId);
  const chosen = points.find((p) => p.node.id === selected);
  const edges = points
    .flatMap((p) =>
      p.node.next.map((id) => ({ from: p, to: points.find((v) => v.node.id === id)! })),
    )
    .filter((e) => e.to);
  return { ch, role, t, setSelected, columns, points, chosen, edges };
}
