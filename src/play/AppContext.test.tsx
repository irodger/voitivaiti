import {it,expect,vi} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
vi.mock('../content/localization',async original=>{const actual=await original<typeof import('../content/localization')>();return {...actual,useI18n:()=>({t:(key:string)=>key,locale:'ru'})};});
vi.mock('../content/scenarios',()=>({resolveTaskTemplate:()=>({titleKey:'task-title',descriptionKey:'task-description',steps:[{id:'source',app:'ide',titleKey:'source-title',bodyKey:'source-body',actionFlow:{actions:[{id:'inspect',code:'actual inspected source',artifact:{kind:'network',titleKey:'network-title',rows:[{id:'seen',labelKey:'seen-label',detailKey:'seen-detail'},{id:'hidden',labelKey:'hidden-label',detailKey:'hidden-detail'}]}},{id:'later',code:'later discovered source'}]}},{id:'logs',app:'console',titleKey:'logs-title',bodyKey:'logs-body'},{id:'review',app:'chat',titleKey:'review-title',bodyKey:'future-review-answer'}]})}));
import {collectAppEvidence} from './appEvidence';
import {AppContext} from './AppContext';
import type {Task} from '../world/types';
const task={currentStepId:'source',progress:{source:{status:'active',observations:{code:'code-observation'},actionHistory:['inspect'],artifactReadings:{inspect:['seen']}},logs:{status:'completed',observations:{log:'log-observation'}},review:{status:'locked'}}} as unknown as Task;
it('apps show their own observations instead of the same global note list',()=>{const ide=renderToStaticMarkup(<AppContext app="ide" task={task} onContinue={()=>{}}/>),console=renderToStaticMarkup(<AppContext app="console" task={task} onContinue={()=>{}}/>);expect(ide).toContain('actual inspected source');expect(ide).toContain('code-observation');expect(ide).not.toContain('log-observation');expect(console).toContain('log-observation');expect(console).not.toContain('code-observation');});
it('browser exposes inspected network data and keeps unread records hidden',()=>{const html=renderToStaticMarkup(<AppContext app="browser" task={task} onContinue={()=>{}}/>);expect(html).toContain('seen-detail');expect(html).not.toContain('hidden-detail');});
it('chat does not reveal a future review answer',()=>{const html=renderToStaticMarkup(<AppContext app="chat" task={task} onContinue={()=>{}}/>);expect(html).not.toContain('future-review-answer');expect(html).toContain('appContext.noMessages');});

it('IDE retains every actually inspected source and offers a source selector',()=>{
 const found={...task,progress:{...task.progress,source:{...task.progress.source,actionHistory:['inspect','later']}}};
 expect(collectAppEvidence(found,'ide').sources).toEqual(['actual inspected source','later discovered source']);
 const html=renderToStaticMarkup(<AppContext app="ide" task={found} onContinue={()=>{}}/>);
 expect(html).toContain('evidence-source-tabs');expect(html).toContain('later discovered source');expect(html).toContain('shelf.search');
});
it('uninspected source fragments are excluded from the evidence collection',()=>{
 expect(collectAppEvidence(task,'ide').sources).not.toContain('later discovered source');
 expect(collectAppEvidence(task,'browser').records.map(x=>x.row.id)).toEqual(['seen']);
});
it('empty reference apps have one return and no empty viewer or zero counters',()=>{
 const emptyTask={...task,progress:{source:{status:'active'},logs:{status:'locked'},review:{status:'locked'}}} as unknown as Task;
 for(const app of ['ide','browser','console','chat'] as const){
  const html=renderToStaticMarkup(<AppContext app={app} task={emptyTask} onContinue={()=>{}}/>);
  expect(html.match(/<button/g)).toHaveLength(1);
  expect(html).toContain('context-empty-reference');
  expect(html).not.toContain('evidence-counts');expect(html).not.toContain('context-next');
  expect(html).not.toContain('future-review-answer');
 }
});
