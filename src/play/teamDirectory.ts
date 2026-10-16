import { textSearch } from '../utils/textSearch';
import type { Campaign } from '../world/types';
import { activeCharacter } from '../world/simulation';
import { availableTopics } from '../content/contextDialogue';
import { professionById } from '../content/professions';
import { characterName } from '../utils/characterName';
import { teamExpectations } from './teamExpectations';
export type TeamFilters = { query: string; onlyNew: boolean; profession: string };
/** Build topic lists once per teammate; filtering never consumes conversations or rewards. */
export function teamDirectory(w: Campaign, filters: TeamFilters, t: (key: string) => string) {
  const ch = activeCharacter(w);
  const people = w.characters.filter(
    (c) =>
      c.id !== ch.id &&
      c.employed &&
      (!ch.firstDay ||
        ch.firstDay.onboardingCompleted ||
        ch.firstDay.introducedNpcIds.includes(c.id)),
  );
  const members = people.map((person) => {
    const topics = availableTopics(w, person),
      unreadTopics = topics.filter((topic) => !ch.conversations?.[person.id + ':' + topic.id]);
    return {
      person,
      role: professionById[person.profession],
      topics,
      unreadTopics,
      fresh: unreadTopics.some((topic) => topic.kind !== 'small'),
      trust: ch.relationships.find((r) => r.characterId === person.id)?.trust ?? 20,
    };
  });
  const seenTopics = new Set<string>(),
    seenPeople = new Set<string>();
  const suggestions = members
    .flatMap(({ person: c, unreadTopics }) =>
      unreadTopics.filter((topic) => topic.kind === 'contextual').map((topic) => ({ c, topic })),
    )
    .filter(({ c, topic }) => {
      if (seenTopics.has(topic.id) || seenPeople.has(c.id)) return false;
      seenTopics.add(topic.id);
      seenPeople.add(c.id);
      return true;
    })
    .slice(0, 3);
  const search = textSearch(filters.query);
  const visible = members.filter(
    ({ person, role, fresh }) =>
      (!filters.onlyNew || fresh) &&
      (filters.profession === 'all' || person.profession === filters.profession) &&
      search.matches([
        characterName(person, t),
        t(role.titleKey),
        t(role.careers.find((node) => node.id === person.careerNodeId)?.titleKey ?? ''),
      ]),
  );
  return {
    people,
    visible,
    suggestions,
    topics: members.filter((member) => member.fresh).length,
    companyNameKey: w.company!.nameKey,
    expectations: teamExpectations(w).filter((e) => people.some((person) => person.id === e.npcId)),
  };
}
export type TeamDirectory = ReturnType<typeof teamDirectory>;
export type TeamMember = TeamDirectory['visible'][number];
