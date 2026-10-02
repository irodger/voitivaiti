import {hasNewTopic} from '../content/contextDialogue';
import {Conversation} from './Conversation';
import {useState} from 'react';
import {useWorld} from '../world/store';
import {activeCharacter} from '../world/simulation';
import {professionById} from '../content/professions';
import {useI18n} from '../content/localization';
import {CharacterAvatar} from '../components/CharacterAvatar';
import {Button,characterName} from './shared';

export function Team(){const w=useWorld(),ch=activeCharacter(w),{t}=useI18n(),[selected,setSelected]=useState<string|null>(null);return <section className="collection-view world-collection"><p className="eyebrow">{t(w.company!.nameKey)}</p><h1>{t('ui.team')}</h1><div className="world-team-grid">{w.characters.filter(c=>c.id!==ch.id&&c.employed&&(!ch.firstDay||ch.firstDay.onboardingCompleted||ch.firstDay.introducedNpcIds.includes(c.id))).map(c=><article className="world-card" key={c.id}><div className="team-person"><CharacterAvatar id={c.avatarId} size={55}/><div><h2>{characterName(c,t)}</h2><small>{t(professionById[c.profession].careers.find(n=>n.id===c.careerNodeId)!.titleKey)}</small></div></div>{c.completedWork.length>0&&<p className="former-hero">{t('ui.formerHero')} · {c.completedWork.length} {t('ui.tasksDone').toLowerCase()}</p>}{c.personality&&<small>{t('roster.'+c.personality)}</small>}<p>{t('ui.relationship',{value:ch.relationships.find(r=>r.characterId===c.id)?.trust??20})}</p><Button secondary onClick={()=>{setSelected(c.id);}}>{t('ui.talk')}{hasNewTopic(w,c)?' •':''}</Button></article>)}</div>{selected&&<Conversation npcId={selected} onClose={()=>setSelected(null)}/>}</section>}
