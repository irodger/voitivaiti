import {it,expect,vi} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
vi.mock('../content/localization',async original=>{const actual=await original<typeof import('../content/localization')>();return {...actual,useI18n:()=>({t:actual.translate,locale:'ru'})};});
vi.mock('../world/store',()=>({useWorld:(selector?:(state:unknown)=>unknown)=>selector?selector({dispatch:vi.fn()}):{dispatch:vi.fn()}}));
import {WorkArtifact} from './WorkArtifact';
import {TechnicalScene} from './TechnicalScene';
import type {StepProgress,TechnicalAction,Step} from '../world/types';
const progress:StepProgress={status:'active',draft:[],allocation:{},clicks:0,run:'idle',charged:false};
const action:TechnicalAction={id:'trace',labelKey:'ui.inspect',observationKey:'ui.success',minutes:10,artifact:{kind:'network',titleKey:'ui.browser',promptKey:'artifact.hint',rows:[{id:'first',labelKey:'ui.inspect',detailKey:'ui.success'},{id:'retry',labelKey:'ui.inspect',detailKey:'ui.success'},{id:'note',optional:true,labelKey:'ui.inspect',detailKey:'ui.success'}]}};
it('explains the missing evidence and does not require optional notes',()=>{
 const pending=renderToStaticMarkup(<WorkArtifact action={action} progress={progress}/>);
 expect(pending).toContain('Просмотрено записей: 0 из 2');expect(pending).toContain('Осталось записей: 2');expect(pending).toContain('class="artifact-compare" disabled');
 const ready=renderToStaticMarkup(<WorkArtifact action={action} progress={{...progress,artifactReadings:{trace:['first','retry']}}}/>);
 expect(ready).toContain('Просмотрено записей: 2 из 2');expect(ready).not.toContain('class="artifact-compare" disabled');
});
it('previous evidence has no submit button or unfinished-task instructions',()=>{
 const html=renderToStaticMarkup(<WorkArtifact action={action} progress={{...progress,artifactReadings:{trace:['first']}}} readOnly/>);
 expect(html).not.toContain('artifact-compare');expect(html).not.toContain('artifact-progress');expect(html).not.toContain('workspace.remaining');
});
it('keeps earlier observations available while the latest result and next action remain visible',()=>{
 const first={...action,id:'first',artifact:undefined},latest={...action,id:'latest',artifact:undefined,next:['next']},next={...action,id:'next',artifact:undefined};
 const step:Step={id:'test',type:'choice',app:'browser',titleKey:'ui.work',bodyKey:'ui.work',effects:[],minutes:0,wrongMinutes:0,wrongEffects:[],actionFlow:{initial:['first'],actions:[first,latest,next]}};
 const html=renderToStaticMarkup(<TechnicalScene step={step} progress={{...progress,actionHistory:['first','latest']}} readOnly={false}/>);
 expect(html).toContain('<details class="observation-history">');expect(html).toContain('Ранее в этом шаге · 1');expect(html).toContain('latest-observation');expect(html).toContain('technical-actions');
});
