import '../content/conferences';
import { conferenceBlock } from '../world/conferences';
import { Button,Modal } from './shared';
import { useConferenceInvitation } from './useConferenceInvitation';
export function ConferenceInvitation(){
 const model=useConferenceInvitation();
 if(!model)return null;
 const {skipConference,w,t,open,setOpen,topic,setTopic,offer,last}=model;

 return <><button onClick={()=>setOpen(true)}>{t(offer?'conference.invite':'conference.notes')} ↗</button>{open&&<Modal title={t('conference.title')} onClose={()=>setOpen(false)}>{offer?<><p>{t('conference.intro')}</p><fieldset><legend>{t('conference.title')}</legend>{(['evidence','handoff'] as const).map(id=><label key={id} style={{display:'block',padding:'10px 0'}}><input type="radio" name="conference-topic" checked={topic===id} onChange={()=>setTopic(id)}/> {t('conference.'+id)}</label>)}</fieldset>{(['online','visit'] as const).map(mode=>{const block=conferenceBlock(w,mode);return <div key={mode}>{block?<p>{t('conference.'+mode)} — {t('conference.'+block)}</p>:<Button secondary onClick={()=>w.dispatch({type:'conference',mode,topic})}>{t('conference.'+mode)}</Button>}</div>})}<Button secondary onClick={skipConference}>{t('conference.skip')}</Button></>:<><h3>{t('conference.'+last!.topic)}</h3><p>{t('conference.'+last!.topic+'Note')}</p></>}</Modal>}</>;
}
