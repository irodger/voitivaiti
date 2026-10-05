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

import {deskAvailability} from './deskAvailability';
it('spends only the needed game minutes, unlocks replies and grants no task experience',()=>{
 const {c,task}=waiting();const before=structuredClone(activeCharacter(c)),project=structuredClone(c.company!.projects[0]),minutes=task.taskElapsedMinutes;
 expect(waitingTask(c,task)).toMatchObject({canWait:true,waitMinutes:30});const after=transition(c,{type:'wait-for-reply',id:task.id}).campaign,saved=after.tasks.find(t=>t.id===task.id)!;
 expect(after.time).toBe(c.time+30);expect(saved.progress[saved.currentStepId].dependency!.ready).toBe(true);expect(saved.taskElapsedMinutes).toBe(minutes);expect(activeCharacter(after).experience).toEqual(before.experience);expect(activeCharacter(after).skills).toEqual(before.skills);expect(after.company!.projects[0]).toEqual(project);
 expect(transition(after,{type:'wait-for-reply',id:task.id}).campaign).toEqual(after);
 const restored=migrateLegacy(JSON.parse(JSON.stringify(after)));const resumed=transition(restored,{type:'resume-task',id:task.id}).campaign;expect(activeTask(resumed)?.id).toBe(task.id);
});
it('caps waiting at the shift boundary and rejects waiting at home or during other work',()=>{
 const {c,task}=waiting();c.time=1070;task.progress[task.currentStepId].dependency!.dueMinute=1100;expect(waitingTask(c,task).waitMinutes).toBe(10);
 let after=transition(c,{type:'wait-for-reply',id:task.id}).campaign;expect(after.time).toBe(1080);expect(waitingTask(after,after.tasks.find(t=>t.id===task.id)!).canWait).toBe(false);
 c.phase='home';expect(transition(c,{type:'wait-for-reply',id:task.id}).campaign).toEqual(c);c.phase='office';c.activeTaskId=task.id;expect(transition(c,{type:'wait-for-reply',id:task.id}).campaign).toEqual(c);
});
it('does not advertise the same paused task as new work',()=>{
 const {c,task}=waiting();task.workKind='bug';c.life!.queue.forEach(q=>q.status=q.id==='bug'?'waiting':'done');expect(deskAvailability(c)).toMatchObject({eligible:[],reason:'waiting'});
 const after=transition(c,{type:'take-task'}).campaign;expect(after.activeTaskId).toBeNull();expect(after.tasks).toHaveLength(c.tasks.length);
});
