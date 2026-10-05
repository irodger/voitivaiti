import '../content/careerReport';
import '../content/progressionUx';
import {Trophy,CalendarDays,Clock3,CheckCircle2} from 'lucide-react';
import {useState} from 'react';
import {useWorld} from '../world/store';
import {activeCharacter} from '../world/simulation';
import {buildCareerReport} from '../world/careerReport';
import {useI18n} from '../content/localization';
import {Button,Modal} from './shared';
import './careerVictory.css';
export function CareerVictory({onContinue,onClose}:{onContinue:()=>void;onClose:()=>void}){
 const w=useWorld(),{t}=useI18n(),ch=activeCharacter(w);
 const [summary]=useState(()=>{const timing=useWorld.getState().characters.find(n=>n.id===ch.id)?.runTiming;return {completed:w.tasks.filter(task=>task.characterId===ch.id&&task.rewarded).length,report:buildCareerReport(w,'hired_successor'),timing,now:Date.now(),terms:ch.discoveredTerms.length,promotions:ch.careerHistory.filter(e=>e.kind==='promotion').length};});
 const stats=summary.report.stats;
 const values=[['tasks',summary.completed,CheckCircle2],['days',stats.calendarDays,CalendarDays],['played',stats.playedDays,CalendarDays],['active',summary.timing?Math.round(summary.timing.activeMs/60000):null,Clock3],['real',summary.timing?.startedAt!==undefined?Math.floor((summary.now-summary.timing.startedAt)/86400000):null,Clock3]] as const;
 const achievements=[['fixes',stats.properFixes],['reviewed',stats.reviews],['delegated',stats.delegationsChecked],['terms',summary.terms],['promotions',summary.promotions]] as const;
 return <Modal title={t('flow.summary')} onClose={onClose}><section className="career-victory"><header><Trophy size={48}/><p className="eyebrow">{ch.name}</p><h2>{t('flow.victory')}</h2><p>{t('flow.victoryBody')}</p></header><div className="victory-stats">{values.map(([id,value,Icon])=><article key={id}><Icon size={22}/><strong>{value??'—'}</strong><span>{t('flow.'+id)}</span></article>)}</div>{(!summary.timing?.startedAt)&&<small>{t(summary.timing?'flow.partial':'flow.unknown')}</small>}<h3>{t('flow.achievements')}</h3><ul>{achievements.filter(([,count])=>count>0).map(([id,count])=><li key={id}><CheckCircle2 size={18}/>{t('flow.'+id,{count})}</li>)}</ul><details><summary>{t('report.timeline')}</summary>{summary.report.gradeHistory.map((grade,i)=><p key={i}>{t('ui.day',{day:grade.day})} · {t(grade.titleKey)}</p>)}</details><p className="victory-note">{t('flow.preview')}</p><div className="victory-actions"><Button onClick={onContinue}>{t('flow.plus')}</Button><Button secondary onClick={onClose}>{t('flow.stay')}</Button></div></section></Modal>;
}
