import { ArrowLeft,Check,Clock3,Footprints,House,Leaf,MapPin,Waves } from 'lucide-react';
import { CharacterAvatar } from '../components/CharacterAvatar';
import '../content/walk';
import { walkRoutes } from '../world/walk';
import { dayPhase } from '../world/workLoop';
import { Button } from './shared';
import { useWalk } from './useWalk';
import './walk.css';

const icons={courtyard:Footprints,park:Leaf,river:Waves};
const paths={courtyard:'M 27 47 Q 29 56 27 65',park:'M 27 47 Q 34 56 44 59 T 53 72 Q 63 77 66 62',river:'M 27 47 Q 34 56 44 59 Q 52 58 58 48 T 72 43 Q 76 38 83 36'};
export function Walk(){
 const {w,ch,t,outing,available,route,finished,choose,returnHome}=useWalk();

 return <div className="world-work walk-world">
  <section className={`walk-scene phase-${dayPhase(w.time)}`} aria-label={t('walk.neighborhood')}>
   <div className="walk-frame">
    <img className="walk-art" src={`${import.meta.env.BASE_URL}art/neighborhood-premium.webp`} alt={t('walk.alt')}/>
    <img className="walk-art walk-night-art" src={`${import.meta.env.BASE_URL}art/neighborhood-night.webp`} alt="" aria-hidden="true"/>
    <div className="walk-evening-light" aria-hidden="true"/>
    <button className="walk-hotspot walk-home-hotspot" onClick={returnHome}><House size={15}/><span>{t('walk.back')}</span><ArrowLeft size={13}/></button>
    {finished&&route?<>
     <svg className="walk-trail" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path className="trail-shadow" d={paths[route.id]}/><path className="trail-line" pathLength="1" d={paths[route.id]}/></svg>
     <div className="walk-player" style={{left:route.x+'%',top:route.y+'%'}}><CharacterAvatar id={ch.avatarId} size={24}/><span>{t('ui.youHere')}</span></div>
    </>:available.map(r=>{const Icon=icons[r.id];return <button className={`walk-hotspot route-${r.id}`} style={{left:r.x+'%',top:r.y+'%'}} key={r.id} onClick={()=>choose(r.id)}><Icon size={15}/><span>{t('walk.'+r.id)}</span><small>{r.minutes}′</small></button>})}
   </div>
   <div className="walk-scene-header"><MapPin size={14}/>{t('walk.neighborhood')}<span>{t('walk.'+dayPhase(w.time))}</span></div>
   <div className="walk-scene-footer">{t(finished?'walk.result':'walk.choose')}</div>
  </section>
  <section className="world-task-panel walk-panel">
   <div className="walk-panel-top"><button onClick={returnHome}><ArrowLeft size={15}/>{t('walk.back')}</button>{finished&&<span><Check size={14}/>{t('walk.minutes',{minutes:outing.minutes??0})}</span>}</div>
   <div className="office-content">
    <h1>{t(finished?'walk.result':'walk.title')}</h1>
    {finished?<>
     <p className="walk-observation" role="status">{t(outing.observationKey??'walk.done')}</p>
     <div className="walk-summary"><div><Clock3 size={18}/><span>{t('walk.minutes',{minutes:outing.minutes??0})}</span></div><div><Leaf size={18}/><span>{t('walk.actual',{before:outing.stressBefore??ch.stats.stress,after:outing.stressAfter??ch.stats.stress})}</span></div></div>
     <p>{t('walk.done')}</p>
     <Button onClick={returnHome}>{t('walk.back')}</Button>
    </>:<>
     <p>{t(ch.stats.stress>=60?'walk.tired':'walk.intro')}</p>
     <p className="walk-time"><Clock3 size={14}/>{t('walk.budget',{minutes:Math.max(0,1440-w.time)})}</p>
     <div className="walk-routes">{available.map(r=>{const Icon=icons[r.id];return <button key={r.id} onClick={()=>choose(r.id)}><Icon size={21}/><div><h2>{t('walk.'+r.id)}</h2><p>{t('walk.'+r.id+'.brief')}</p><small>{t('ui.min',{value:r.minutes})} · {t('ui.stress')} −{r.stress}</small></div><span aria-hidden="true">↗</span></button>})}</div>
     {available.length<walkRoutes.length&&<p className="fine-print">{t('walk.short')}</p>}
    </>}
   </div>
  </section>
 </div>;
}
