import { BookOpen,Check,Footprints,Gamepad2,Moon,Utensils } from 'lucide-react';
import { dayPhase } from '../world/workLoop';
import { ActionDock } from './ActionDock';
import { DayReport } from './DayReport';
import { FirstEveningGuide } from './FirstEveningGuide';
import { PersonalFinance } from './PersonalFinance';
import { RoutinePanel } from './RoutinePanel';
import { Button,formatTime } from './shared';
import { HomeStatus } from './SpaceStatus';
import { useHomeEvening } from './useHomeEvening';
const activityIcons={walk:Footprints,cook:Utensils,read:BookOpen,games:Gamepad2};
export function HomeEvening() {
 const {w,ch,home,rest,t,money,ids,done,available,act,hasActivity,eveningActivities}=useHomeEvening();
 return <><FirstEveningGuide/><p className="eyebrow">{t('ui.day', { day: w.company!.currentDay })}</p><h1>{t('loop.' + dayPhase(w.time))}</h1><HomeStatus /><DayReport/>{w.phase === 'home' && w.life?.routineSummary && <><p>{t('loop.routine', { time: formatTime(w.life.routineSummary.to) })}</p>{w.life.routineSummary.unfinished && <p>{t('loop.carried')}</p>}</>}<p>{t('loop.rest', rest)}</p>{w.phase === 'home' && <p className="evening-clock">{t('evening.time', { time: formatTime(w.time) })}</p>}<div className="home-activities">{ids.map(id => done.includes(id) ? <div className="evening-completed" key={id}><Check size={16}/>{t('evening.done.' + id)}</div> : available(id) ? <Button key={id} secondary disabled={w.phase !== 'home'} onClick={() => act(id)}>{(() => {const Icon=activityIcons[id as keyof typeof activityIcons];return Icon?<Icon size={18} aria-hidden="true"/>:null;})()}{t(id === 'walk' ? 'walk.range' : (id === 'games' ? 'life.' : 'home.') + id, { value: id === 'cook' ? (home.owned.includes('kitchen') ? 30 : 15) : (1 + (home.owned.includes('library') ? 1 : 0)) })}{id !== 'walk' && <> · {t('ui.min', { value: eveningActivities[id] })}</>}</Button> : null)}{w.phase === 'home' && !hasActivity && <p>{t('evening.finished')}</p>}</div><PersonalFinance character={ch} daily={Math.max(0, (w.life?.livingCost ?? 1200) - 600)}/><div className="home-pay-note">{home.lastPay > 0 && <b>{t('home.paid', { price: money(home.lastPay) })}</b>}<p>{t('home.payNote')}</p></div><ActionDock><Button disabled={w.phase !== 'home'} onClick={() => w.dispatch({ type: 'sleep' })}><Moon size={16}/>{t('ui.sleep')}</Button></ActionDock>{w.phase !== 'home' && <p>{t('ui.homeLocked')}</p>}<RoutinePanel /></>; }
