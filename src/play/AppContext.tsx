import {useI18n} from '../content/localization';
import {TermText} from './TermText';
import {Button,Code} from './shared';
import {resolveTaskTemplate} from '../content/scenarios';
import type {AppId,Task} from '../world/types';
import '../content/workArtifacts';
import './workArtifact.css';
export function AppContext({app,task,onContinue}:{app:AppId;task:Task;onContinue:()=>void}){
 const {t}=useI18n(),template=resolveTaskTemplate(task),step=template.steps.find(s=>s.id===task.currentStepId)!;
 const observations=Object.values(task.progress).flatMap(p=>Object.values(p.observations??{}));
 const sources=template.steps.flatMap(s=>(task.progress[s.id]?.actionHistory??[]).map(id=>s.actionFlow?.actions.find(a=>a.id===id)?.code).filter((code):code is string=>!!code));
 const reference=app==='chat'?template.steps.at(-1)!.bodyKey:app==='ide'?step.bodyKey:template.descriptionKey;
 return <section className="artifact-reference"><small>{t('artifact.context')}</small><h2>{t('ui.'+app)}</h2>
 <article><b>{t(template.titleKey)}</b><p><TermText>{t(reference)}</TermText></p></article>
 {app==='ide'&&sources.length>0&&<Code text={sources.at(-1)!}/>}
 <h3>{t('artifact.notes')}</h3>{observations.length?observations.map((key,i)=><article key={i}><TermText>{t(key)}</TermText></article>):<p>{t('artifact.none')}</p>}
 <p>{t('artifact.contextHint',{app:t('ui.'+step.app)})}</p><Button onClick={onContinue}>{t('ui.goApp',{app:t('ui.'+step.app)})}</Button></section>;
}
