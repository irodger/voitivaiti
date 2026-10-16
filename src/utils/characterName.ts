import type { Character } from '../world/types';
/** Translate predefined names; retain player-entered names verbatim. */
export function characterName(character: Pick<Character, 'name'>, t: (key: string) => string) {
  return character.name.startsWith('roster.') || character.name.startsWith('npc.')
    ? t(character.name)
    : character.name;
}
