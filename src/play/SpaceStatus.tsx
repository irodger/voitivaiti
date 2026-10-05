import {deskAvailability} from '../world/deskAvailability';
import {Laptop2,ArrowUpRight,Users,Layers,BatteryMedium,Moon,Activity} from 'lucide-react';
import {useWorld} from '../world/store';
import {activeCharacter,activeTask} from '../world/simulation';
import {resolveTaskTemplate} from '../content/scenarios';
import {recovery} from '../world/economy';
import {useI18n} from '../content/localization';
import '../content/spacesUx';
import './spaces.css';

export function OfficeStatus({openLaptop}:{openLaptop:()=>void}){
 const w=useWorld(),{t}=useI18n(),task=activeTask(w),current=task&&!task.rewarded?resolveTaskTemplate(task):undefined,ch=activeCharacter(w),queue=deskAvailability(w).eligible.length;
 return <div className="space-status office-status"><div className="space-status-heading"><span className="space-status-icon"><Laptop2 size={23}/></span><div><small>{t('spaces.office')}</small><h3>{t(current?current.titleKey:'desk.tasks')}</h3></div><button onClick={openLaptop} aria-label={t('ui.openLaptop')}><ArrowUpRight size={20}/></button></div><div className="space-status-facts"><span><Layers size={15}/><b>{queue}</b>{t('spaces.queue')}</span><span><Users size={15}/><b>{w.characters.filter(c=>c.employed&&c.id!==ch.id).length}</b>{t('spaces.people')}</span></div></div>;
}
export function HomeStatus(){
 const ch=useWorld(w=>activeCharacter(w)),{t}=useI18n(),rest=recovery(ch);
 return <div className="space-status home-status"><div className="space-status-heading"><span className="space-status-icon"><Moon size={23}/></span><div><small>{t('ui.home')}</small><h3>{t('spaces.home')}</h3></div></div><div className="home-status-meters">{[{Icon:BatteryMedium,label:'spaces.energy',value:ch.stats.energy},{Icon:Activity,label:'spaces.stress',value:ch.stats.stress}].map(({Icon,label,value})=><div key={label}><span><Icon size={15}/>{t(label)}<b>{value}/100</b></span><meter min={0} max={100} value={value} aria-label={t(label)}/></div>)}</div><p className="sleep-preview"><Moon size={15}/><span><b>{t('spaces.sleep')}</b><small>{t('spaces.recovery',rest)}</small></span></p></div>;
}
