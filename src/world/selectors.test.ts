import { describe, expect, it } from 'vitest';
import type { Character, Task } from './types';
import { activeCharacter, activeTask, findActiveCharacter } from './selectors';

describe('campaign selection', () => {
  it('supports startup and a missing character without selecting a different actor', () => {
    expect(findActiveCharacter({ characters: [], activeCharacterId: '' })).toBeUndefined();
    expect(
      findActiveCharacter({
        characters: [{ id: 'other' } as Character],
        activeCharacterId: 'missing',
      }),
    ).toBeUndefined();
  });

  it('follows the selected character and returns the existing object for mutations', () => {
    const characters = [{ id: 'first' }, { id: 'second' }] as Character[];
    const campaign = { characters, activeCharacterId: 'second' };
    expect(activeCharacter(campaign)).toBe(characters[1]);
    campaign.activeCharacterId = 'first';
    expect(activeCharacter(campaign)).toBe(characters[0]);
    expect(characters.map((character) => character.id)).toEqual(['first', 'second']);
  });

  it('distinguishes a selected task, a stale ID and no task', () => {
    const tasks = [{ id: 'old' }, { id: 'current' }] as Task[];
    expect(activeTask({ tasks, activeTaskId: 'current' })).toBe(tasks[1]);
    expect(activeTask({ tasks, activeTaskId: 'missing' })).toBeUndefined();
    expect(activeTask({ tasks, activeTaskId: null })).toBeUndefined();
  });
});
