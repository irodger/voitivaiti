import {MessageCircle,Check,ArrowRight,HeartHandshake,CalendarCheck,MessagesSquare} from 'lucide-react';
import type {ConversationSession} from '../hooks/useConversation';
import {useI18n} from '../content/localization';
import {formatCalendarDate} from '../utils/format';
import {characterName} from '../utils/characterName';
import {Speech} from './shared';

function ConversationReplyDock({session}:{session:ConversationSession}){
 const {t,locale}=useI18n(),{topic,choice,changed,trustDelta,skillDelta,due,setTopic,next,reply}=session;
 if(!topic)return null;
 return <footer className="conversation-reply-dock">{choice?<>
  <div className="conversation-outcome"><h4><Check size={16}/>{t(changed?'teamChat.result':'teamChat.saved')}</h4>
   {changed?<>
    <div className="conversation-result-chips">
     {trustDelta!==0&&<span><HeartHandshake size={15}/>{t('teamChat.trust')} {trustDelta>0?'+':''}{trustDelta}</span>}
     {skillDelta!==0&&<span><MessagesSquare size={15}/>{t('teamChat.skill')} {skillDelta>0?'+':''}{skillDelta}</span>}
     {due!==undefined&&<span><CalendarCheck size={15}/>{t('teamChat.deadline')} · {formatCalendarDate(due,locale)}</span>}
    </div>
    {!trustDelta&&!skillDelta&&due===undefined&&<p>{t('teamChat.noChange')}</p>}
   </>:<p>{t('teamChat.historyHint')}</p>}
  </div>
  <p>{t('teamChat.done')}</p><div>
   <button className="world-secondary" onClick={()=>setTopic(null)}>{t('teamChat.back')}</button>
   {next&&<button className="primary-button" onClick={()=>setTopic(next.id)}>{t('teamChat.next')}<ArrowRight size={16}/></button>}
  </div>
 </>:<>
  <p>{t('teamChat.reply')}</p>
  {topic.choices.map(choice=><button className="conversation-reply" key={choice.id} onClick={()=>reply(choice.id)}>{t(choice.labelKey)}<ArrowRight size={18}/></button>)}
 </>}</footer>;
}
export function ConversationTopicStage({session}:{session:ConversationSession}){
 const {t}=useI18n(),{topic,choice,npcId,threadRef,ch}=session;
 if(!topic)return null;
 const selected=topic.selection?.length?topic.selection.map(item=>t(item.labelKey)+(item.amount===undefined?'':': '+item.amount)).join(' → '):topic.choiceLabelKey?t(topic.choiceLabelKey):'';
 return <>
  <header className="conversation-topic-heading"><span><MessageCircle size={15}/>{t('teamChat.'+(choice?'saved':'new'))}</span><h3>{t(topic.titleKey)}</h3></header>
  <div className="conversation-thread" key={topic.id} ref={threadRef} aria-live="polite">
   <Speech speaker={npcId}>{t(topic.bodyKey,{choice:selected})}</Speech>
   {choice&&<>
    <div className="conversation-player"><small>{characterName(ch,t)}</small><p>{t(choice.labelKey)}</p><Check size={14}/></div>
    <Speech speaker={npcId}>{t(choice.responseKey)}</Speech>
   </>}
  </div>
  <ConversationReplyDock session={session}/>
 </>;
}
