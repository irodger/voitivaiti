import '../content/careerReport';
import {useI18n} from '../content/localization';
import {useWorld} from '../world/store';
import type {CareerReport as Report,ReportLine} from '../world/careerReport';
import './careerReport.css';

export function CareerReport({report,characterId}:{report:Report;characterId:string}){
 const {t}=useI18n(),w=useWorld();
 const render=(line:ReportLine,index:number)=><article className="career-report-entry" data-evidence-count={line.sources.length} key={line.sources.join(':')+index}>
  {line.titleKey&&<strong>{t(line.titleKey)}</strong>}
  {line.person&&<strong>{line.person.startsWith('roster.')?t(line.person):line.person}</strong>}
  <p>{t(line.key,line.values)}</p>
  {line.detailKeys?.map((key,i)=><p key={key+i}>{t(key,line.values)}</p>)}
  {line.problemId&&line.taskId&&w.company?.projects.flatMap(p=>p.problems).find(p=>p.id===line.problemId)?.story?.encounters.filter(e=>e.actorId!==characterId&&[w.tasks.find(task=>task.id===e.taskId)?.encounter?.previousTaskId,w.tasks.find(task=>task.id===e.taskId)?.encounter?.originTaskId].includes(line.taskId)).slice(-1).map(e=>{const name=w.characters.find(n=>n.id===e.actorId)?.name??e.actorId;return <p key={e.taskId}>{t('report.continuation',{name:name.startsWith('roster.')?t(name):name})}</p>;})}
 </article>;
 return <div className="career-report">
  <section aria-label={t('report.title')} className="career-report-reason">{report.reason.map(render)}</section>
  <section><h2>{t('report.timeline')}</h2>{report.timeline.map(render)}</section>
  <section><h2>{t('report.decisions')}</h2>{report.decisions.map(render)}</section>
  <section><h2>{t('report.patterns')}</h2>{report.patterns.length?report.patterns.map(render):<p>{t('report.emptyPatterns')}</p>}</section>
  <details><summary>{t('report.stats')}</summary><dl>{Object.entries(report.stats).filter(([key,value])=>value>0||['calendarDays','playedDays','completedTasks','maxStress'].includes(key)).map(([key,value])=><div key={key}><dt>{t('report.stat.'+key)}</dt><dd>{value}</dd></div>)}</dl></details>
 </div>;
}
