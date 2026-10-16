import { Activity,ArrowRight,CheckCircle2,Layers,ShieldCheck } from 'lucide-react';
import type { Project } from '../world/types';
import { Button,characterName } from './shared';
import { TermText } from './TermText';
import { useCompanyProject } from './useCompanyProject';
export function CompanyProject({project:p}:{project:Project}){
const {w,t,current,blocked,known}=useCompanyProject({project:p});

 return <article className="world-card company-project"><header><span className="company-project-icon"><Layers size={22}/></span><div><h2>{t(p.nameKey)}</h2>{current&&<small className="company-current"><CheckCircle2 size={13}/>{t('ui.currentProject')}</small>}</div></header><div className="company-project-metrics"><span title={t('companyPage.debt')}><Layers size={14}/>{t('ui.techDebt')} <b>{p.techDebt}/100</b></span><span title={t('companyPage.stability')}><Activity size={14}/>{t('ui.stability')} <b>{p.stability}/100</b></span><span title={t('companyPage.security')}><ShieldCheck size={14}/>{t('ui.securityLevel')} <b>{p.securityLevel}/100</b></span></div>
 {!current&&(blocked?<p className="company-switch-note">{t('companyPage.blocked')}</p>:<Button secondary onClick={()=>w.dispatch({type:'assign-project',id:p.id})}>{t('ui.joinProject')} <ArrowRight size={14}/></Button>)}
 <h3>{t('ui.problems')}</h3>{known.length===0&&<p className="fine-print">{t('companyPage.empty')}</p>}{known.map(problem=>{const actor=w.characters.find(c=>c.id===problem.causedBy),owner=w.company!.structure?.teams.find(team=>team.id===problem.ownerTeamId);return <div className="company-problem" id={'company-problem-'+problem.id} key={problem.id}><span className={problem.status==='resolved'?'resolved-dot':'event-dot'}/><div><b>{t(problem.titleKey)}</b><small>{t('companyPage.status.'+problem.status)}</small>{owner&&<small>{t('org.ownership')}: {t(owner.nameKey)}</small>}{problem.latestOutcomeKey&&<p><TermText>{t(problem.latestOutcomeKey)}</TermText></p>}{problem.workaround&&<p className="company-workaround">{t('companyPage.temporary')}</p>}{actor&&<p>{t('ui.oldDecision',{name:characterName(actor,t)})}</p>}</div></div>;})}
 <details className="company-tech"><summary>{t('companyPage.technical')}</summary><p>{p.stack.join(' · ')}</p>{known.map(problem=><p key={problem.id}>{t(problem.titleKey)}: {problem.affectedSystems.join(' → ')}</p>)}</details></article>;
}
