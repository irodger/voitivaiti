import {it,expect,vi} from 'vitest';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
import {collectAppEvidence,appHasEvidence} from './appEvidence';
import {beginPlaytest} from '../world/playtestHelpers';
import {makeTask} from '../world/simulation';
it('shows only inspected design records in the designer material editor, including after reload',()=>{
 const c=beginPlaytest('designer'),task=makeTask(c);
 task.scene={...task.scene!,steps:[{id:'screen',type:'visual-compare',items:[{id:'chosen',labelKey:'selected-fact'},{id:'unread',labelKey:'unknown-fact'}],app:'browser',titleKey:'screen',bodyKey:'body',actionFlow:{actions:[{id:'look',artifact:{kind:'design',titleKey:'mockup',rows:[{id:'seen',labelKey:'visible'},{id:'hidden',labelKey:'secret'}]}}]}}]} as typeof task.scene;
 task.currentStepId='screen';task.progress={screen:{status:'active',draft:['chosen'],allocation:{},clicks:0,run:'idle',charged:false,artifactReadings:{look:['seen']}}};
 const before=JSON.stringify(task);
 expect(collectAppEvidence(task,'ide','design').records.map(r=>r.row.id)).toEqual(['seen']);expect(appHasEvidence(task,'ide','design')).toBe(true);expect(collectAppEvidence(task,'ide','design').notes).toEqual(['selected-fact']);
 expect(collectAppEvidence(task,'ide').records).toHaveLength(0);
 expect(collectAppEvidence(JSON.parse(before),'ide','design').records.map(r=>r.row.id)).toEqual(['seen']);expect(JSON.stringify(task)).toBe(before);
});

it('collects an actually selected plan from the legacy chat slot without exposing unchosen items',()=>{
 const task=makeTask(beginPlaytest('project'));
 task.scene={...task.scene!,steps:[{id:'plan',app:'chat',type:'planning',items:[{id:'chosen',labelKey:'agreed-plan'},{id:'hidden',labelKey:'unselected-plan'}]}]} as typeof task.scene;
 task.currentStepId='plan';task.progress={plan:{status:'completed',draft:['chosen'],allocation:{},clicks:0,run:'idle',charged:false}};
 const before=JSON.stringify(task);
 expect(collectAppEvidence(task,'ide','planning').notes).toEqual(['agreed-plan']);expect(collectAppEvidence(task,'ide').notes).toEqual([]);
 expect(collectAppEvidence(JSON.parse(before),'ide','planning').notes).toEqual(['agreed-plan']);expect(JSON.stringify(task)).toBe(before);
});
