import {useState} from 'react';
import '../content/conferences';
import {useWorld} from '../world/store';
import {activeCharacter} from '../world/simulation';
import {conferenceOffer,conferenceBlock} from '../world/conferences';
import {useI18n} from '../content/localization';
import {Button,Modal} from './shared';
export function ConferenceInvitation(){
 const w=useWorld(),{t}=useI18n(),[open,setOpen]=useState(false),[topic,setTopic]=useState<'evidence'|'handoff'>('evidence');
 const offer=conferenceOffer(w),last=activeCharacter(w).conferences?.at(-1);
 if(!offer&&(!last||last.mode==='skip'))return null;
 return <><button onClick={()=>setOpen(true)}>{t(offer?'conference.invite':'conference.notes')} ↗</button>{open&&<Modal title={t('conference.title')} onClose={()=>setOpen(false)}>{offer?<><p>{t('conference.intro')}</p><fieldset><legend>{t('conference.title')}</legend>{(['evidence','handoff'] as const).map(id=><label key={id} style={{display:'block',padding:'10px 0'}}><input type="radio" name="conference-topic" checked={topic===id} onChange={()=>setTopic(id)}/> {t('conference.'+id)}</label>)}</fieldset>{(['online','visit'] as const).map(mode=>{const block=conferenceBlock(w,mode);return <div key={mode}>{block?<p>{t('conference.'+mode)} — {t('conference.'+block)}</p>:<Button secondary onClick={()=>w.dispatch({type:'conference',mode,topic})}>{t('conference.'+mode)}</Button>}</div>})}<Button secondary onClick={()=>{w.dispatch({type:'conference',mode:'skip',topic});setOpen(false);}}>{t('conference.skip')}</Button></>:<><h3>{t('conference.'+last!.topic)}</h3><p>{t('conference.'+last!.topic+'Note')}</p></>}</Modal>}</>;
}
