import { hasNewTopic } from '../content/contextDialogue';
import { useI18n } from '../content/localization';
import { activeCharacter } from '../world/simulation';
import { useWorld } from '../world/store';
import { teamExpectations } from './teamExpectations';
export function useOfficeContacts() {
  const w = useWorld();
  const { t } = useI18n();
  const hero = activeCharacter(w);
  const expectations = teamExpectations(w);
  const people = w.characters
    .filter(
      (c) =>
        c.employed &&
        c.id !== hero.id &&
        (!hero.firstDay ||
          hero.firstDay.onboardingCompleted ||
          hero.firstDay.introducedNpcIds.includes(c.id)),
    )
    .slice(0, 5)
    .map((person) => ({
      person,
      waiting: expectations.filter((e) => e.npcId === person.id),
      fresh: hasNewTopic(w, person),
    }));
  if (!people.length) return null;
  return { w, t, hero, people };
}
