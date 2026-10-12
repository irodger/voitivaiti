import {ArrowUpRight,MessagesSquare,ListTodo,Compass,Coffee} from 'lucide-react';
import {useWorld} from '../world/store';
import {useI18n} from '../content/localization';
import {deskPulse} from '../world/deskPulse';
import {resolveTaskTemplate} from '../content/scenarios';
import '../content/deskPulse';
import './deskPulse.css';

export function DeskPulse({onResume,onOffice,onWaiting,onQueue}:{onResume:()=>void;onOffice?:()=>void;onWaiting:()=>void;onQueue:()=>void}){
 const w=useWorld(),{t}=useI18n(),pulse=deskPulse(w);
 const next=pulse.focus==='task'?onResume:pulse.focus==='queue'?(pulse.selectable?onQueue:undefined):pulse.focus==='offDuty'?undefined:onOffice;
 return <section className="desk-pulse" aria-label={t('deskPulse.focus')}><div className="desk-pulse-grid"><button className="desk-pulse-focus" disabled={!next} onClick={next}><span className="pulse-icon"><Compass size={22}/></span><small>{t('deskPulse.focus')}</small><strong>{t(pulse.focus==='task'&&pulse.current?resolveTaskTemplate(pulse.current).titleKey:'deskPulse.'+pulse.focus)}</strong><p>{t('deskPulse.'+pulse.focus+'Hint')}</p>{next&&<ArrowUpRight className="pulse-arrow" size={18}/>}</button><button data-pulse="answers" disabled={!pulse.saved&&!pulse.currentReply} onClick={pulse.currentReply?onResume:onWaiting}><MessagesSquare size={21}/><small>{t(pulse.saved&&!pulse.ready&&!pulse.awaiting?'deskPulse.savedLabel':'deskPulse.answers')}</small><strong>{pulse.ready||pulse.awaiting?<>{pulse.ready} <span>/ {pulse.ready+pulse.awaiting}</span></>:pulse.saved}</strong><p>{pulse.ready?t('deskPulse.ready',{count:pulse.ready}):pulse.awaiting?t('deskPulse.awaiting',{count:pulse.awaiting}):t(pulse.saved?'deskPulse.saved':'deskPulse.noWaiting',{count:pulse.saved})}</p></button><button data-pulse="queue" disabled={!pulse.selectable} onClick={onQueue}><ListTodo size={21}/><small>{t(pulse.selectable?'deskPulse.choose':'deskPulse.queued')}</small><strong>{pulse.queued}</strong><p>{t(pulse.reason?'deskPulse.blocked.'+pulse.reason:'deskPulse.queueHint')}</p></button></div><p className="desk-pulse-note"><Coffee size={14}/>{t('deskPulse.joke')}</p></section>;
}
