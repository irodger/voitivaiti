import { Bug, CreditCard, Gauge, PackageCheck, ShieldCheck } from 'lucide-react';
import { useI18n } from '../content/localization';
import { resolveTaskTemplate } from '../content/scenarios';
import { activeCharacter } from '../world/simulation';
import { useWorld } from '../world/store';
import type { Task } from '../world/types';
const icons = {
  interface: Bug,
  payment: CreditCard,
  performance: Gauge,
  access: ShieldCheck,
  delivery: PackageCheck,
};
export function useTaskBrief(props: { task: Task }) {
  const { task } = props;
  const { t } = useI18n();
  const world = useWorld();
  const characters = world.characters;
  const first = activeCharacter(world).firstDay;
  const template = resolveTaskTemplate(task);
  const Icon = icons[template.category];
  const author = characters.find((ch) => ch.id === (task.legacyActorId ?? template.author));
  const guided = !!first && !first.onboardingCompleted;
  const current = task.progress[task.currentStepId];
  const done = template.steps.filter(
    (step) => task.progress[step.id]?.status === 'completed',
  ).length;
  return { t, template, Icon, author, guided, current, done };
}
