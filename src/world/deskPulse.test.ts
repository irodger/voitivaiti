import {it,expect,vi} from 'vitest';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
import {beginPlaytest} from './playtestHelpers';
import {makeTask,activeCharacter} from './simulation';
import {deskPulse} from './deskPulse';
import {gameConfig} from '../config/game';

function setup(){const c=beginPlaytest('frontend');activeCharacter(c).completedWork=['one','two','three'];activeCharacter(c).firstDay!.onboardingCompleted=true;c.schedule.forEach(e=>e.status='completed');c.phase='office';c.activeTaskId=null;return c;}
it('never calls blocked or off-duty queue items selectable and excludes the active item',()=>{
 const c=setup();expect(deskPulse(c).selectable).toBe(2);
 const task=makeTask(c);task.workKind='bug';c.tasks.push(task);c.activeTaskId=task.id;
 expect(deskPulse(c)).toMatchObject({focus:'task',queued:1,selectable:0});
 c.schedule.push({id:'sync',type:'sync',status:'pending',key:'sync'});expect(deskPulse(c)).toMatchObject({focus:'sync',selectable:0});
 c.phase='home';expect(deskPulse(c)).toMatchObject({focus:'offDuty',selectable:0});
 c.phase='office';c.activeTaskId=null;c.schedule=[];c.time=gameConfig.clock.lastTaskStart;expect(deskPulse(c)).toMatchObject({reason:'late',selectable:0});
});
it('counts actual current-stage requests and excludes earlier replies and consumed reply actions',()=>{
 const c=setup(),task=makeTask(c);c.tasks.push(task);c.activeTaskId=task.id;
 task.scene={...task.scene!,steps:[{id:'now',app:'chat',type:'choice',titleKey:'now',bodyKey:'now',minutes:0,wrongMinutes:0,effects:[],wrongEffects:[],actionFlow:{initial:['read'],actions:[{id:'read',requiresReply:true,labelKey:'read',observationKey:'read',minutes:0}]}}]};
 task.currentStepId='now';task.progress.now={status:'active',draft:[],allocation:{},clicks:0,run:'idle',charged:false,dependency:{npcId:'owner',dueDay:1,dueMinute:900,ready:false}};
 expect(deskPulse(c)).toMatchObject({currentReply:true,awaiting:1,ready:0});
 task.progress.now.dependency!.ready=true;expect(deskPulse(c).ready).toBe(1);
 task.progress.now.actionHistory=['read'];expect(deskPulse(c)).toMatchObject({currentReply:false,ready:0,awaiting:0});
 task.paused=true;c.activeTaskId=null;expect(deskPulse(c)).toMatchObject({saved:1,ready:0,awaiting:0});
 const before=JSON.stringify(c);expect(deskPulse(JSON.parse(before))).toEqual(deskPulse(c));expect(JSON.stringify(c)).toBe(before);
});
