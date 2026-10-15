import {Code2,Palette,ShieldCheck,Compass,HeartHandshake,ArrowUpRight,Sparkles} from 'lucide-react';
import type {TeamMember} from './teamDirectory';
import {CharacterAvatar} from '../components/CharacterAvatar';
import {useI18n} from '../content/localization';
import {Button,characterName} from './shared';
import '../content/teamView';
function appearance(family:string){if(['design','research'].includes(family))return {Icon:Palette,tone:'design'};if(family==='qa')return {Icon:ShieldCheck,tone:'quality'};if(['product','analysis'].includes(family))return {Icon:Compass,tone:'product'};return {Icon:Code2,tone:'engineering'};}
export function TeamMemberCard({member,onTalk}:{member:TeamMember;onTalk:(id:string,topic?:string)=>void}){
 const {t}=useI18n(),{person:c,role,trust,fresh,unreadTopics}=member,{Icon,tone}=appearance(role.family);
 return <article className={'team-member tone-'+tone} key={c.id}>
  <div className="team-member-cover">
  <Icon className="team-cover-symbol" size={94}/>
  <div className="team-member-portrait">
  <CharacterAvatar id={c.avatarId} size={84}/>
  <span>
  <Icon size={17}/>
  </span>
  </div>{fresh&&<span className="team-new-topic">
  <Sparkles size={12}/>{t('teamView.new')}</span>}</div>
  <div className="team-member-body">
  <h2>{characterName(c,t)}</h2>
  <p className="team-member-role">{t(role.careers.find(n=>n.id===c.careerNodeId)?.titleKey??role.titleKey)}</p>
  <p className="team-member-purpose">{t(role.descriptionKey)}</p>
  <div className="team-topic-preview">
  <small>{t('teamView.discuss')}</small>{unreadTopics.slice(0,2).map(topic=>
  <button key={topic.id} onClick={()=>onTalk(c.id,topic.id)}>{t(topic.titleKey)}<ArrowUpRight size={13}/>
  </button>)}</div>{c.personality&&<span className="team-personality">{t('roster.'+c.personality)}</span>}
  {c.completedWork.length>0&&<p className="team-former">{t('ui.formerHero')} · {c.completedWork.length} {t('ui.tasksDone').toLowerCase()}</p>}<div className="team-trust">
  <div>
  <HeartHandshake size={15}/>
  <span>{t('teamView.trust')}</span>
  <b>{trust}</b>
  </div>
  <div className="team-trust-track" aria-hidden="true">
  <i style={{width:`${Math.max(0,Math.min(100,trust))}%`}}/>
  </div>
  <small>{t('teamView.trustHelp')}</small>
  </div>
  <Button secondary onClick={()=>onTalk(c.id)}>{t('ui.talk')}<ArrowUpRight size={17}/>
  </Button>
  </div>
  </article>;
}
