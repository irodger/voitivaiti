import {it,expect} from 'vitest';
import {planOrder} from './planOrder';
import {templateById} from '../content/scenarios';
import {transition} from './engine';
import {emptyCampaign,activeCharacter,activeTask} from './simulation';
import {migrateLegacy} from './store';
it('keeps every action through reorder, reload and confirmation',()=>{
 let c=transition(emptyCampaign(),{type:'new',name:'Test',avatarId:'1',professionId:'designer',seed:1427}).campaign;
 delete activeCharacter(c).firstDay;
 c=transition(c,{type:'event',id:c.schedule[0].id,choiceId:'plan'}).campaign;
 c=transition(c,{type:'take-task'}).campaign;
 const task=activeTask(c)!;task.templateId='priority.feature';task.currentStepId='evidence';
 task.progress.evidence={status:'active',draft:['edge'],allocation:{},clicks:0,run:'idle',charged:false};
 task.progress.handoff={status:'locked',draft:[],allocation:{},clicks:0,run:'idle',charged:false};
 c=migrateLegacy(JSON.parse(JSON.stringify(c)));
 expect(activeTask(c)!.progress.evidence.draft).toEqual(['edge','original','report']);
 c=transition(c,{type:'draft',id:'report'}).campaign;
 expect(activeTask(c)!.progress.evidence.draft).toEqual(['report','edge','original']);
 c=transition(c,{type:'submit'}).campaign;
 expect(activeTask(c)!.progress.evidence.status).toBe('completed');
 expect(activeTask(c)!.progress.evidence.draft).toHaveLength(3);
 c=transition(c,{type:'advance'}).campaign;
 expect(activeTask(c)!.currentStepId).toBe('handoff');
});
it('fills a new plan and preserves the chosen order without duplicate actions',()=>{
 const step=templateById['priority.feature'].steps[1];
 expect(planOrder(step,[])).toEqual(['original','edge','report']);
 expect(planOrder(step,['edge','edge','unknown'])).toEqual(['edge','original','report']);
});
