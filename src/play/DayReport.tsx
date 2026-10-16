import { ArrowUpRight,Clock3,Coffee } from 'lucide-react';
import '../content/dayReport';
import { resolveTaskTemplate } from '../content/scenarios';
import './dayReport.css';
import { Modal } from './shared';
import { TermText } from './TermText';
import { useDayReport } from './useDayReport';
import { WorkArtifact } from './WorkArtifact';
import { WorkJournalHeader } from './WorkJournalHeader';

export function DayReport(){
 const model=useDayReport();
 if(!model)return null;
 const {w,t,setSelected,report,task,scene,completedSteps,observations}=model;

 return <section className="day-report"><WorkJournalHeader kind="day" title={t('dayReport.title')} counts={[{label:'journal.delivered',value:report.tasks.filter(r=>r.state==='delivered').length},{label:'journal.open',value:report.tasks.filter(r=>r.state!=='delivered'||r.temporary).length+report.waiting.length}]}/>{!report.tasks.length&&<p>{t('dayReport.empty')}</p>}{report.tasks.map(record=>{const saved=w.tasks.find(task=>task.id===record.id);if(!saved)return null;const team=w.company?.structure?.teams.find(team=>team.id===record.recipientTeamId);return <article key={record.id} data-tone={record.temporary?'boundary':'result'}><small>{t('dayReport.'+record.state)}</small><h3>{t(resolveTaskTemplate(saved).titleKey)}</h3>{record.summaryKey&&<p><TermText>{t(record.summaryKey)}</TermText></p>}{team&&<p>{t('dayReport.recipient',{team:t(team.nameKey)})}</p>}{record.temporary&&<b>{t('dayReport.temporary')}</b>}{record.evidenceOnly&&<p>{t('dayReport.evidenceOnly')}</p>}<button onClick={()=>setSelected(record.id)}>{t('dayReport.materials')}<ArrowUpRight size={16}/></button></article>;})}{report.waiting.length>0&&<details><summary><Clock3 size={16}/>{t('dayReport.queue')} · {report.waiting.length}</summary>{report.waiting.map(q=>{const problem=w.company?.projects.find(p=>p.id===q.projectId)?.problems.find(p=>p.id===q.problemId);return <p key={q.id}><b>{t(problem?.titleKey??'life.work.'+q.id)}</b>{q.dueDay!==undefined&&<span>{t('dayReport.due',{day:q.dueDay})}</span>}{q.overdue&&<span>{t('dayReport.overdue')}</span>}</p>;})}</details>}<p className="journal-aside"><Coffee size={15}/>{t('journal.dayJoke')}</p>{task&&scene&&<Modal title={t(scene.titleKey)} onClose={()=>setSelected(null)}><p>{t('dayReport.readonly')}</p>{task.outcome&&task.rewarded&&<p><TermText>{t(task.outcome.summaryKey)}</TermText></p>}{!observations.length&&!completedSteps.length&&<p>{t('dayReport.noEvidence')}</p>}{completedSteps.filter(step=>!task.progress[step.id]?.actionHistory?.length).map(step=><details key={step.id}><summary>{t(step.titleKey)}</summary><p>{t('taskScene.checked')}</p>{task.progress[step.id].responseKey&&<p><TermText>{t(task.progress[step.id].responseKey!)}</TermText></p>}</details>)}{observations.map(({action,progress},i)=><details key={i}><summary>{t(action.labelKey)}</summary><p><TermText>{t(progress.observations?.[action.id]??action.observationKey)}</TermText></p>{action.artifact&&<WorkArtifact action={action} progress={progress} readOnly/>}</details>)}</Modal>}</section>;
}
