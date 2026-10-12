import {History,MessageSquare,CheckCircle2} from 'lucide-react';
import {useWorld} from '../world/store';
import {useI18n} from '../content/localization';
import {colleagueWorkMemory} from '../world/colleagueWorkMemory';
import {formatCalendarDate} from '../utils/format';
import {TermText} from './TermText';
import '../content/workMemory';
import './colleagueWorkMemory.css';

export function ColleagueWorkMemory({npcId}:{npcId:string}){
 const w=useWorld(),{t,locale}=useI18n(),memories=colleagueWorkMemory(w,npcId);
 return <section className="colleague-work-memory"><p>{t('workMemory.hint')}</p>{!memories.length&&<p>{t('workMemory.empty')}</p>}{memories.map(memory=><article key={memory.id}><header>{memory.kind==='reply'?<MessageSquare size={18}/>:<CheckCircle2 size={18}/>}<small>{t('workMemory.'+memory.kind)}</small>{memory.day!==undefined&&<time>{formatCalendarDate(memory.day,locale)}</time>}</header><h4>{t(memory.titleKey)}</h4><p><TermText>{t(memory.factKey)}</TermText></p>{memory.temporary&&<span><History size={14}/>{t('workMemory.boundary')}</span>}{memory.evidenceOnly&&<span>{t('workMemory.evidence')}</span>}</article>)}</section>;
}
