import { describe,it,expect,vi } from 'vitest';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
import { transition } from './engine';
import { emptyCampaign,activeTask,activeCharacter } from './simulation';
import { migrateLegacy } from './store';
import { templateById } from '../content/scenarios';
import { advanceCalendar } from './life';
import { resolveDecisions } from './decisions';
import { availableTopics } from '../content/contextDialogue';
function start(){let c=transition(emptyCampaign(),{type:'new',name:'Test',avatarId:'1',professionId:'delivery',seed:1427}).campaign;delete c.characters.find(n=>n.id===c.activeCharacterId)!.firstDay;c=transition(c,{type:'event',id:c.schedule[0].id,choiceId:'plan'}).campaign;return transition(c,{type:'take-task'}).campaign;}
describe('professional decisions',()=>{
 it('accepts a different release plan and either resolution, preserving the first committed choice',()=>{
  for(const choice of ['bad','durable']){let c=start();const task=activeTask(c)!,step=templateById[task.templateId].steps[0];expect(step.resolution).toBe('consequential');c=transition(c,{type:'draft',id:'item-2'}).campaign;c=transition(c,{type:'submit'}).campaign;expect(activeTask(c)!.progress[step.id].status).toBe('completed');c=transition(c,{type:'advance'}).campaign;c=transition(c,{type:'choose',id:choice}).campaign;const snapshot=JSON.stringify(c);expect(activeTask(c)!.progress.resolve.status).toBe('completed');expect(c.life!.decisions.technicalMistakes).toBe(0);expect(c.life!.professionalDecisions).toHaveLength(2);expect(JSON.stringify(transition(c,{type:'choose',id:choice==='bad'?'durable':'bad'}).campaign)).toBe(snapshot);const restored=migrateLegacy(JSON.parse(snapshot));expect(restored.life!.professionalDecisions).toEqual(c.life!.professionalDecisions);expect(activeTask(restored)!.progress.resolve.choiceId).toBe(choice);}
 });
 it('applies stored consequences once across reload and gives an NPC the actual recorded choice',()=>{
  let c=start();c=transition(c,{type:'draft',id:'item-2'}).campaign;c=transition(c,{type:'submit'}).campaign;c=transition(c,{type:'advance'}).campaign;c=transition(c,{type:'choose',id:'bad'}).campaign;const original=c.life!.professionalDecisions!.at(-1)!;expect(original.context).toHaveProperty('stability');expect(original.immediateEffects.length).toBeGreaterThan(0);const restored=migrateLegacy(JSON.parse(JSON.stringify(c)));for(let i=0;i<5;i++){advanceCalendar(c);advanceCalendar(restored);}expect(restored).toEqual(c);expect(c.life!.professionalDecisions!.every(d=>d.resolved)).toBe(true);const after=JSON.stringify(c);resolveDecisions(c);expect(JSON.stringify(c)).toBe(after);const npc=c.characters.find(n=>n.id===original.npcId)!;expect(availableTopics(c,npc).find(t=>t.id==='decision-'+original.decisionId)?.choiceLabelKey).toBe(original.choiceLabelKey);
 });
 it('backfills old saves without changing completed work or mechanical progress',()=>{const c=start();delete c.life!.professionalDecisions;const old=JSON.parse(JSON.stringify(c));const restored=migrateLegacy(old);expect(restored.life!.professionalDecisions).toEqual([]);expect(restored.tasks).toEqual(c.tasks);expect(activeCharacter(restored).stats).toEqual(activeCharacter(c).stats);});
});

it('accepts incomplete UX observations and persists specific later feedback',()=>{
 let c=transition(emptyCampaign(),{type:'new',name:'Test',avatarId:'1',professionId:'designer',seed:1427}).campaign;
 delete activeCharacter(c).firstDay;c=transition(c,{type:'event',id:c.schedule[0].id,choiceId:'plan'}).campaign;c=transition(c,{type:'take-task'}).campaign;
 expect(activeTask(c)!.templateId).toBe('design-checkout');c=transition(c,{type:'draft',id:'item-0'}).campaign;c=transition(c,{type:'submit'}).campaign;
 expect(activeTask(c)!.progress.investigate.status).toBe('completed');expect(activeTask(c)!.attemptsByStep.investigate??0).toBe(1);
 c=migrateLegacy(JSON.parse(JSON.stringify(c)));expect(c.life!.professionalDecisions![0].explanationKey).toBe('fix.missedTotal');
 expect(c.life!.professionalDecisions![0].selection).toHaveLength(1);c=transition(c,{type:'advance'}).campaign;expect(activeTask(c)!.currentStepId).toBe('resolve');
 for(let i=0;i<5;i++)advanceCalendar(c);expect(c.life!.professionalDecisions![0].resolved).toBe(true);
});
