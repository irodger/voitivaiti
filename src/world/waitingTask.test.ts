import {it,expect} from 'vitest';
import {waitingTask} from './waitingTask';
import {emptyCampaign,activeCharacter,activeTask} from './simulation';
import {transition} from './engine';
import {migrateLegacy} from './store';
function waiting(){let c=transition(emptyCampaign(),{type:'new',name:'Wait',avatarId:'1',professionId:'frontend',seed:1427}).campaign;activeCharacter(c).firstDay=undefined;c=transition(c,{type:'event',id:c.schedule[0].id,choiceId:'plan'}).campaign;c=transition(c,{type:'take-task'}).campaign;const task=activeTask(c)!;task.progress[task.currentStepId].dependency={npcId:'sergey',dueDay:c.life!.calendarDay,dueMinute:c.time+30,ready:false};task.paused=true;c.activeTaskId=null;return {c,task};}
it('uses the current dependency even if an earlier step has a ready reply',()=>{
 const {c,task}=waiting(),current=task.progress[task.currentStepId];task.progress.old={...current,dependency:{...current.dependency!,ready:true}};
 expect(waitingTask(c,task)).toMatchObject({ready:false,remaining:30,canResume:true,today:true});
 current.dependency!.ready=true;expect(waitingTask(c,task).ready).toBe(true);
});
it('retains timing through reload and explains resume restrictions without losing work',()=>{
 const {c,task}=waiting(),loaded=migrateLegacy(JSON.parse(JSON.stringify(c))),saved=loaded.tasks.find(t=>t.id===task.id)!;
 expect(waitingTask(loaded,saved)).toMatchObject({remaining:30,canResume:true});
 loaded.activeTaskId=saved.id;expect(waitingTask(loaded,saved)).toMatchObject({busy:true,canResume:false});loaded.activeTaskId=null;loaded.phase='home';expect(waitingTask(loaded,saved).canResume).toBe(false);
 saved.progress[saved.currentStepId].dependency!.dueDay++;expect(waitingTask(loaded,saved).today).toBe(false);
});
