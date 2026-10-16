import { CheckCircle2,Trophy } from 'lucide-react';
import '../content/careerReport';
import '../content/progressionUx';
import './careerVictory.css';
import { Button,Modal } from './shared';
import { useCareerVictory } from './useCareerVictory';
export function CareerVictory({onContinue,onClose}:{onContinue:()=>void;onClose:()=>void}){
 const {t,ch,summary,values,achievements}=useCareerVictory();

 return <Modal title={t('flow.summary')} onClose={onClose}><section className="career-victory"><header><Trophy size={48}/><p className="eyebrow">{ch.name}</p><h2>{t('flow.victory')}</h2><p>{t('flow.victoryBody')}</p></header><div className="victory-stats">{values.map(([id,value,Icon])=><article key={id}><Icon size={22}/><strong>{value??'—'}</strong><span>{t('flow.'+id)}</span></article>)}</div>{(!summary.timing?.startedAt)&&<small>{t(summary.timing?'flow.partial':'flow.unknown')}</small>}<h3>{t('flow.achievements')}</h3><ul>{achievements.filter(([,count])=>count>0).map(([id,count])=><li key={id}><CheckCircle2 size={18}/>{t('flow.'+id,{count})}</li>)}</ul><details><summary>{t('report.timeline')}</summary>{summary.report.gradeHistory.map((grade,i)=><p key={i}>{t('ui.day',{day:grade.day})} · {t(grade.titleKey)}</p>)}</details><p className="victory-note">{t('flow.preview')}</p><div className="victory-actions"><Button onClick={onContinue}>{t('flow.plus')}</Button><Button secondary onClick={onClose}>{t('flow.stay')}</Button></div></section></Modal>;
}
