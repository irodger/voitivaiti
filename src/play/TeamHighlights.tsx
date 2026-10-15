import {MessagesSquare,ArrowUpRight} from 'lucide-react';
import type {TeamDirectory} from './teamDirectory';
import {CharacterAvatar} from '../components/CharacterAvatar';
import {useI18n} from '../content/localization';
import {Button,characterName} from './shared';
import {WorkItemContext} from './WorkItemContext';
import '../content/teamView';
export function TeamHighlights({directory,onWork,onTalk}:{directory:TeamDirectory;onWork?:()=>void;onTalk:(id:string,topic?:string)=>void}){
 const {t}=useI18n(),{people,expectations,suggestions}=directory;
 return <>{!!expectations.length&&<section className="team-work-expectations">
  <h2>{t('teamView.expectations')}</h2>{expectations.map(({item,npcId,task})=>{const npc=people.find(c=>c.id===npcId)!;return <article key={item.id}>
  <CharacterAvatar id={npc.avatarId} size={40}/>
  <div>
  <small>{t('expect.'+item.expectation!.state)}</small>
  <b>{t('life.work.'+item.id)}</b>{task&&<small>{task.id}</small>}<WorkItemContext item={item}/>
  </div>{onWork&&<Button secondary onClick={onWork}>{t('teamView.task')}<ArrowUpRight size={16}/>
  </Button>}</article>})}</section>}
  {!!suggestions.length&&<div className="team-conversation-inbox">
  <div>
  <MessagesSquare size={20}/>
  <h2>{t('teamChat.focus')}</h2>
  </div>{suggestions.map(({c,topic})=>
  <button key={c.id+topic.id} onClick={()=>onTalk(c.id,topic.id)}>
  <CharacterAvatar id={c.avatarId} size={40}/>
  <span>
  <small>{characterName(c,t)}</small>
  <b>{t(topic.titleKey)}</b>
  <small>{t('teamView.topic')}</small>
  </span>
  <ArrowUpRight size={18}/>
  </button>)}</div>}</>;
}
