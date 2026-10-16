import { activeTask } from './selectors';
import type {Campaign,Task} from './types';

import {deskAvailability} from './deskAvailability';
import {resolveTaskTemplate} from '../content/scenarios';
function pendingReply(task?:Task){
 if(!task)return;
 const progress=task.progress[task.currentStepId],step=resolveTaskTemplate(task).steps.find(s=>s.id===task.currentStepId);
 if(!progress?.dependency||progress.status==='completed'||progress.actionHistory?.some(id=>step?.actionFlow?.actions.some(a=>a.id===id&&a.requiresReply)))return;
 return progress.dependency;
}
export function deskPulse(c:Campaign){
 const task=activeTask(c),state=deskAvailability(c),current=task&&!task.rewarded?task:undefined;
 const activeReply=pendingReply(current),currentReply=!!activeReply;
 const replies=[...state.waiting.map(pendingReply),...(activeReply?[activeReply]:[])].filter(d=>!!d);
 const ready=replies.filter(d=>d!.ready).length,awaiting=replies.filter(d=>!d!.ready).length;
 const queued=state.eligible.filter(q=>q.id!==current?.workKind).length;
 const focus=state.reason==='offDuty'?'offDuty':state.reason==='sync'?'sync':state.reason==='review'?'review':current?.status==='blocked'?'incident':current?'task':'queue';
 return {focus,current,currentReply,ready,awaiting,saved:state.waiting.length,queued,selectable:state.reason===null?queued:0,reason:state.reason};
}
