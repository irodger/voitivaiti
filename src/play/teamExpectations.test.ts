import {it,expect} from 'vitest';
import {teamExpectations} from './teamExpectations';
import type {Campaign} from '../world/types';
it('ties live expectations to their real owner and problem, excluding resolved work and generic review topics',()=>{
 const world={activeCharacterId:'hero',characters:[{id:'hero',profession:'frontend',careerNodeId:'level-1',completedWork:[]}],life:{queue:[{id:'review',status:'waiting'},{id:'bug',status:'waiting',problemId:'p',projectId:'project',expectation:{state:'overdue',dueDay:2}},{id:'feature',status:'done',expectation:{state:'waiting'}},{id:'debt',status:'waiting',expectation:{state:'resolved'}}]},tasks:[{id:'TASK-1',problemId:'p',projectId:'project'}],company:{projects:[{id:'project',problems:[{id:'p',titleKey:'actual.problem'}]}]}} as unknown as Campaign;
 const items=teamExpectations(world);
 expect(items).toHaveLength(1);expect(items[0].npcId).toBe('max');expect(items[0].problem?.titleKey).toBe('actual.problem');expect(items[0].task?.id).toBe('TASK-1');
});
