import {Compass} from 'lucide-react';
import {useI18n,text} from '../content/localization';
import {activeCharacter,activeTask} from '../world/simulation';
import {useWorld} from '../world/store';
import './firstRunGuide.css';
const copy:Record<string,[string,string]>={
 title:['Первый рабочий день','Your first workday'],
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
 return <aside className="first-run-guide" aria-label={t('firstGuide.title')}><Compass size={21} aria-hidden="true"/><div><b>{t('firstGuide.title')}</b><p>{t('firstGuide.'+stage)}</p></div></aside>;
}
