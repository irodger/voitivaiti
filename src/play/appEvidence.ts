import {resolveTaskTemplate} from '../content/scenarios';
import type {AppId,Task} from '../world/types';
const kinds:Record<AppId,string[]>={ide:['code','component'],browser:['network','design','environment'],console:['metrics','logs'],chat:['task']};
/** The reference apps can only display evidence the player has actually collected. */
export function collectAppEvidence(task:Task,app:AppId){
 const template=resolveTaskTemplate(task),step=template.steps.find(s=>s.id===task.currentStepId)!;
 const relevant=template.steps.filter(s=>s.app===app);
 const notes=relevant.flatMap(s=>[...Object.values(task.progress[s.id]?.observations??{}),...(s.items??[]).filter(item=>task.progress[s.id]?.draft?.includes(item.id)).map(item=>item.detailKey??item.labelKey)]);
 const sources=relevant.filter(s=>task.progress[s.id]?.status==='completed'&&!!s.code).map(s=>s.code!).concat(relevant.flatMap(s=>(task.progress[s.id]?.actionHistory??[]).map(id=>s.actionFlow?.actions.find(a=>a.id===id)?.code).filter((code):code is string=>!!code)));
 const records=template.steps.flatMap(s=>(s.actionFlow?.actions??[]).flatMap(a=>a.artifact&&kinds[app].includes(a.artifact.kind)?a.artifact.rows.filter(r=>task.progress[s.id]?.artifactReadings?.[a.id]?.includes(r.id)).map(row=>({row,kind:a.artifact!.kind,title:a.artifact!.titleKey})):[]));
 const completed=relevant.filter(s=>task.progress[s.id]?.status==='completed');
 return {template,step,relevant,notes,sources,records,completed};
}
