import { CharacterAvatar } from '../components/CharacterAvatar';
import '../content/careerReport';
import { professionById,professions } from '../content/professions';
import { CareerMap } from './CareerMap';
import { CareerPacing } from './CareerPacing';
import { CareerVictory } from './CareerVictory';
import { PromotionCard } from './PromotionCard';
import './careerUx.css';
import { Button,Modal } from './shared';
import { useCareer } from './useCareer';

export function Career({onWork}:{onWork?:()=>void}={}){
 const {hireCandidate,continueHiring,openVictory,role,node,t,victory,setVictory,hiring,setHiring,selected,setSelected,candidate,canHire}=useCareer();
return <section className="collection-view world-collection career-view"><div className="section-heading"><p className="eyebrow">{t(role.titleKey)}</p><h1>{t('ui.careerTitle')}</h1></div><div className="career-next-grid">{node.next.map(id=><PromotionCard onWork={onWork} key={id} nodeId={id}/>)}<article className="world-card hire-card"><p className="eyebrow">{t('ui.handoff')}</p><h2>{t('ui.hire')}</h2><p>{t('ui.hireHelp')}</p><Button disabled={!canHire} onClick={openVictory}>{t('ui.hire')}</Button>{!canHire&&<small>{t('ui.hireBlocked')}</small>}</article></div><CareerMap onWork={onWork}/><CareerPacing/>{victory&&<CareerVictory onClose={()=>setVictory(false)} onContinue={continueHiring}/>}{hiring&&<Modal title={t('ui.hire')} onClose={()=>setHiring(false)}><p>{t('ui.hireHelp')}</p><select value={selected} onChange={e=>setSelected(e.target.value)} aria-label={t('ui.profession')}>{professions.map(p=><option key={p.id} value={p.id}>{t(p.titleKey)}</option>)}</select><div className="candidate-profile"><CharacterAvatar id={candidate.avatarId} size={68}/><div><h2>{candidate.name}</h2><p>{t(professionById[candidate.profession].careers[0].titleKey)}</p><small>{candidate.traits.map(x=>t(`trait.${x}`)).join(' · ')}</small></div></div><p>{t('ui.craft')}: {candidate.skills.craft} · {t('ui.communication')}: {candidate.skills.communication}</p><Button onClick={hireCandidate}>{t('ui.hireAction')}</Button></Modal>}</section>}
