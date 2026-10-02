import type {ReactNode} from 'react';
import {Sparkles,Wallet,BatteryMedium,Activity,Award} from 'lucide-react';
import {useWorld} from '../world/store';
import {activeCharacter} from '../world/simulation';
import {useI18n} from '../content/localization';
import type {Stat} from '../world/types';

export function Hud({children,showResources=true}:{children?:ReactNode;showResources?:boolean}){const w=useWorld(),ch=activeCharacter(w),{t,locale}=useI18n();return <section className={'world-hud focus-hud'+(showResources?'':' focus-only')}>{showResources&&(['money','stress'] as Stat[]).map(key=><div key={key} className={`hud-stat stat-${key}`}><span className="hud-symbol" aria-hidden="true">{key==='money'?<Wallet size={19}/>:key==='energy'?<BatteryMedium size={19}/>:key==='stress'?<Activity size={19}/>:key==='reputation'?<Award size={19}/>:<Sparkles size={19}/>}</span><small>{t(`ui.${key}`)}</small><b>{ch.stats[key].toLocaleString(locale)}{key==='money'?' ₽':key==='energy'||key==='stress'?' / 100':''}</b>{['energy','stress'].includes(key)&&<span className="stat-track"><i style={{width:`${ch.stats[key]}%`}}/></span>}</div>)}{children}</section>}
