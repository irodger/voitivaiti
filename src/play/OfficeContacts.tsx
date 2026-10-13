import {CalendarCheck,MessageCircle,Sparkles,UsersRound,ChevronDown} from 'lucide-react';
import {CharacterAvatar} from '../components/CharacterAvatar';
import {useWorld} from '../world/store';
import {activeCharacter} from '../world/simulation';
import {hasNewTopic,availableTopics} from '../content/contextDialogue';
import {useI18n} from '../content/localization';
import {characterName} from './shared';
import {teamExpectations} from './teamExpectations';
import '../content/officeContacts';
import './officeContacts.css';
export function OfficeContacts({onTalk}:{onTalk:(id:string,topic?:string)=>void}){
 const w=useWorld(),{t}=useI18n(),hero=activeCharacter(w),expectations=teamExpectations(w);
 const people=w.characters.filter(c=>c.employed&&c.id!==hero.id&&(!hero.firstDay||hero.firstDay.onboardingCompleted||hero.firstDay.introducedNpcIds.includes(c.id))).slice(0,5).map(person=>({person,waiting:expectations.filter(e=>e.npcId===person.id),fresh:hasNewTopic(w,person)}));
 if(!people.length)return null;
 return <details className="office-contacts"><summary><UsersRound size={19}/><span><b>{t('officeContacts.title')}</b><small>{t('officeContacts.summary',{people:people.length,waiting:people.filter(p=>p.waiting.length).length})}</small></span><ChevronDown size={16}/></summary><div className="office-contact-content"><p>{t('officeContacts.hint')}</p><div className="office-contact-grid">{people.map(({person,waiting,fresh})=>{const Icon=waiting.length?CalendarCheck:fresh?Sparkles:MessageCircle;
 const title=waiting[0]?.problem?.titleKey;return <button key={person.id} data-contact-id={person.id} data-expectation={waiting.length>0||undefined} onClick={()=>onTalk(person.id,waiting.length?'__commitments':fresh?availableTopics(w,person).find(topic=>!hero.conversations?.[person.id+':'+topic.id])?.id:undefined)}><CharacterAvatar id={person.avatarId} size={36}/><b>{characterName(person,t)}</b><small><Icon size={12}/>{t(waiting.length?'officeContacts.waiting':fresh?'officeContacts.new':'officeContacts.talk',{count:waiting.length})}</small>{title&&<span className="office-contact-task" title={t(title)}>{t(title)}</span>}</button>;})}</div><footer>{t('officeContacts.joke')}</footer></div></details>;
}
