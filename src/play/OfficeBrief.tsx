import { ArrowRight,CheckCircle2,Compass,Laptop2,Layers,Users } from 'lucide-react';
import { CharacterAvatar } from '../components/CharacterAvatar';
import '../content/workspaceStudio';
import { useOfficeBrief } from './useOfficeBrief';
import './workspaceStudio.css';
export function OfficeBrief({openLaptop,openTeam}:{openLaptop:()=>void;openTeam?:()=>void}){
const {w,t,ch,state,task,current,done,reason,showCurrent}=useOfficeBrief();

 return <section className="office-brief"><header><span className="office-brief-mark"><Compass size={23}/></span><div><small>{t('studio.now')}</small><h3>{t(showCurrent?showCurrent.titleKey:'studio.'+reason)}</h3></div><span className="office-brief-count" title={t('spaces.queue')} aria-label={t('spaces.queue')+': '+state.eligible.length}><Layers size={14}/>{state.eligible.length}</span></header>{showCurrent?<div className="office-brief-progress"><div aria-label={t('workspace.steps')}>{showCurrent.steps.map(s=><i key={s.id} className={task?.progress[s.id]?.status==='completed'?'done':s.id===current?.id?'current':''}/>)}</div><span><CheckCircle2 size={13}/>{done} / {showCurrent.steps.length}</span></div>:<p>{t('studio.'+reason+'Hint')}</p>}{showCurrent&&current&&<p className="office-brief-next"><small>{t('studio.next')}</small>{t(current.titleKey)}</p>}<div className="office-brief-actions"><button className="primary-button" onClick={openLaptop}><Laptop2 size={17}/>{t(showCurrent?'studio.open':'studio.queue')}<ArrowRight size={17}/></button>{openTeam&&<button className="world-secondary" onClick={openTeam}><Users size={17}/>{t('studio.team')}</button>}</div><footer><div aria-hidden="true">{w.characters.filter(c=>c.employed&&c.id!==ch.id).slice(0,3).map(c=><CharacterAvatar key={c.id} id={c.avatarId} size={24}/>)}</div><span>{t('studio.officeHint')}</span></footer></section>;
}
