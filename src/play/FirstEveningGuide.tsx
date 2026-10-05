import {CheckCircle2,House,Moon,Sunrise,Wallet,BriefcaseBusiness,ArrowRight} from 'lucide-react';
import {text,useI18n} from '../content/localization';
import {useWorld} from '../world/store';
import {activeCharacter} from '../world/simulation';
import {homeState,recovery} from '../world/economy';
import {formatNumber} from '../utils/format';
import './firstEveningGuide.css';
const copy:Record<string,[string,string]>={
 title:['Первый день пройден','Your first day is complete'],
 body:['Теперь ты дома. Отдых — на твой выбор: прогуляйся, приготовь ужин или сразу ложись спать. Покупать улучшения для продолжения не нужно.','You are home. Rest your way: walk, cook dinner or go straight to sleep. You do not need to buy upgrades to continue.'],
 earned:['Выплачено за день','Paid for this day'],
 tasks:['Работ завершено сегодня','Tasks completed today'],
 rest:['После сна','After sleep'],
 stress:['Стресс: {before} → {after}','Stress: {before} → {after}'],
 office:['Работа завершена','Work finished'],
 home:['Вечер дома','Evening at home'],
 next:['Следующее утро','Next morning'],
 continue:['Как продолжить','How to continue'],
 sleep:['Нажми «Лечь спать» внизу. Начнётся новый рабочий день: сначала встреча команды, затем работа.','Press “Go to sleep” below. A new workday starts with the team meeting, followed by work.']
};
Object.entries(copy).forEach(([key,[ru,en]])=>text('firstEvening.'+key,ru,en));
export function FirstEveningGuide(){
 const w=useWorld(),ch=activeCharacter(w),{t,locale}=useI18n();
 if(w.phase!=='home'||!ch.firstDay?.onboardingCompleted||w.life?.characterPlayedDays!==1)return null;
 const home=homeState(ch),rest=recovery(ch);
 return <section className="first-evening-guide" aria-label={t('firstEvening.title')}>
  <header><span className="first-evening-emblem"><House size={25}/></span><div><small>{t('firstEvening.home')}</small><h2>{t('firstEvening.title')}</h2></div><CheckCircle2 className="first-evening-check" size={25}/></header>
  <p>{t('firstEvening.body')}</p>
  <div className="first-evening-stats"><div><Wallet size={18}/><small>{t('firstEvening.earned')}</small><b>{formatNumber(home.lastPay,locale)} ₽</b></div><div><BriefcaseBusiness size={18}/><small>{t('firstEvening.tasks')}</small><b>{Math.max(0,ch.completedWork.length-w.dayWorkStart)}</b></div><div><Moon size={18}/><small>{t('firstEvening.rest')}</small><b>{t('firstEvening.stress',{before:ch.stats.stress,after:Math.max(0,ch.stats.stress-rest.stress)})}</b></div></div>
  <ol className="first-evening-path"><li><CheckCircle2 size={17}/>{t('firstEvening.office')}</li><li aria-current="step"><House size={17}/>{t('firstEvening.home')}</li><li><Sunrise size={17}/>{t('firstEvening.next')}</li></ol>
  <footer><ArrowRight size={18}/><div><b>{t('firstEvening.continue')}</b><p>{t('firstEvening.sleep')}</p></div></footer>
 </section>;
}
