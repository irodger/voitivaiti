import {CareerMap} from './CareerMap';
import {PromotionCard} from './PromotionCard';
import {CareerPacing} from './CareerPacing';
import {useState} from 'react';
import {useWorld} from '../world/store';
import {activeCharacter,isLeader,candidates} from '../world/simulation';
import {professions,professionById} from '../content/professions';
import {useI18n} from '../content/localization';
import {CharacterAvatar} from '../components/CharacterAvatar';
import {Button,Modal} from './shared';

export function Career(){const w=useWorld(),ch=activeCharacter(w),role=professionById[ch.profession],node=role.careers.find(n=>n.id===ch.careerNodeId)!,{t}=useI18n(),[hiring,setHiring]=useState(false),[selected,setSelected]=useState('qa');const pool=candidates(w),candidate=pool.find(c=>c.profession===selected)!,canHire=isLeader(ch)&&w.schedule.every(e=>e.status==='completed')&&w.phase!=='reward';return <section className="collection-view world-collection"><div className="section-heading"><p className="eyebrow">{t(role.titleKey)}</p><h1>{t('ui.careerTitle')}</h1></div><CareerMap/><CareerPacing/><div className="career-next-grid">{node.next.map(id=><PromotionCard key={id} nodeId={id}/>)}<article className="world-card hire-card"><p className="eyebrow">{t('ui.handoff')}</p><h2>{t('ui.hire')}</h2><p>{t('ui.hireHelp')}</p><Button disabled={!canHire} onClick={()=>setHiring(true)}>{t('ui.hire')}</Button>{!canHire&&<small>{t('ui.hireBlocked')}</small>}</article></div>{hiring&&<Modal title={t('ui.hire')} onClose={()=>setHiring(false)}><p>{t('ui.hireHelp')}</p><select value={selected} onChange={e=>setSelected(e.target.value)} aria-label={t('ui.profession')}>{professions.map(p=><option key={p.id} value={p.id}>{t(p.titleKey)}</option>)}</select><div className="candidate-profile"><CharacterAvatar id={candidate.avatarId} size={68}/><div><h2>{candidate.name}</h2><p>{t(professionById[candidate.profession].careers[0].titleKey)}</p><small>{candidate.traits.map(x=>t(`trait.${x}`)).join(' · ')}</small></div></div><p>{t('ui.craft')}: {candidate.skills.craft} · {t('ui.communication')}: {candidate.skills.communication}</p><Button onClick={()=>{w.dispatch({type:'hire',id:candidate.id});setHiring(false);}}>{t('ui.hireAction')}</Button></Modal>}</section>}
