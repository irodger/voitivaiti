import {Compass,Check,UserRound,UsersRound,MessagesSquare,ClipboardList,Laptop,House,ArrowRight} from 'lucide-react';
import {useI18n,text} from '../content/localization';
import {activeCharacter,activeTask} from '../world/simulation';
import {useWorld} from '../world/store';
import './firstRunGuide.css';
const copy:Record<string,[string,string]>={
 title:['Первый рабочий день','Your first workday'],
 progress:['Пройдено {done} из {total}','{done} of {total} complete'],
 now:['Сейчас','Now'],
 introLabel:['Знакомство','Introductions'],
 contextLabel:['Люди и проект','People and project'],
 meetingLabel:['Утренний синк','Morning sync'],
 briefLabel:['Первая задача','First task'],
 workLabel:['Работа в ноутбуке','Laptop work'],
 homeLabel:['Домой','Go home'],
 next:['Твой следующий шаг','Your next step'],
 map:['Маршрут первого дня','First-day journey'],
 arrival:['Представься команде: введи имя и нажми «Представиться». Это имя твоего героя.','Introduce yourself: enter your name and press the introduction button. This is your character’s name.'],
 order:['Выбери, с чего начать: проект или люди. Ты увидишь оба знакомства, порядок — на твой вкус.','Choose the project or the people first. You will see both introductions; the order is up to you.'],
 project:['Узнай, над чем работает команда. Затем продолжи знакомство кнопкой внизу.','Learn what the team is building, then continue with the button below.'],
 team:['Это знакомство, а не выбор собеседника. Прочитай роли коллег и продолжи кнопкой внизу.','This is an introduction, not a conversation picker. Read the roles, then continue with the button below.'],
 meeting:['Выбери любую реплику. Это знакомство на ежедневной встрече, здесь нет неправильного ответа.','Choose any reply. This is an introduction at the daily meeting, with no wrong answer.'],
 brief:['Возьми первую задачу. Ноутбук откроется сразу: там ты увидишь условия и сделаешь первый шаг.','Take your first task. The laptop opens immediately so you can see the brief and take the first step.'],
 work:['Читай текущий шаг и выбирай действие внизу. Этапы сверху показывают путь; нужное приложение открывается автоматически. Незнакомые подчёркнутые слова можно нажимать.','Read the current step and choose an action below. The stages above show your path; the relevant app opens automatically. Click unfamiliar underlined terms for an explanation.'],
 result:['Проверь, что получилось и какие ограничения остались. Передай результат — затем можно закончить первый день.','Check the result and remaining limitations. Hand it over, then you can finish your first day.'],
 farewell:['Первая работа позади. Закончи день: дома можно отдохнуть, а после сна начнётся следующий рабочий день.','Your first task is behind you. Finish the day: rest at home, then sleep to start the next workday.']
};
Object.entries(copy).forEach(([key,[ru,en]])=>text('firstGuide.'+key,ru,en));
export function FirstRunGuide(){
 const w=useWorld(),{t}=useI18n(),first=activeCharacter(w).firstDay;
 if(!first||first.onboardingCompleted)return null;
 const stage=w.phase==='reward'?'result':first.currentOnboardingStep;
 if(stage==='work'&&!activeTask(w))return null;
 const current=['arrival','order','project','team'].includes(stage)?(stage==='arrival'?0:1):stage==='meeting'?2:stage==='brief'?3:stage==='work'||stage==='result'?4:5;
 const nodes=[{label:'introLabel',Icon:UserRound},{label:'contextLabel',Icon:UsersRound},{label:'meetingLabel',Icon:MessagesSquare},{label:'briefLabel',Icon:ClipboardList},{label:'workLabel',Icon:Laptop},{label:'homeLabel',Icon:House}];
 return <aside className="first-run-guide" aria-label={t('firstGuide.title')}>
  <header className="first-guide-heading"><span className="first-guide-emblem"><Compass size={24} aria-hidden="true"/></span><div><small>{t('firstGuide.map')}</small><b>{t('firstGuide.title')}</b></div><span className="first-guide-count">{t('firstGuide.progress',{done:current,total:nodes.length})}</span></header>
  <progress className="first-guide-progress" value={current} max={nodes.length} aria-label={t('firstGuide.map')}/>
  <ol className="first-guide-route">{nodes.map(({label,Icon},index)=><li key={label} data-state={index<current?'done':index===current?'current':'next'} aria-current={index===current?'step':undefined}><span>{index<current?<Check size={18} aria-hidden="true"/>:<Icon size={18} aria-hidden="true"/>}</span><b>{t('firstGuide.'+label)}</b>{index===current&&<small>{t('firstGuide.now')}</small>}</li>)}</ol>
  <div className="first-guide-instruction"><ArrowRight size={18} aria-hidden="true"/><div><b>{t('firstGuide.next')}</b><p>{t('firstGuide.'+stage)}</p></div></div>
 </aside>;
}
