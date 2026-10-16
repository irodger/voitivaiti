import { CheckCircle2,History,MessageSquare } from 'lucide-react';
import '../content/workMemory';
import { formatCalendarDate } from '../utils/format';
import './colleagueWorkMemory.css';
import { TermText } from './TermText';
import { useColleagueWorkMemory } from './useColleagueWorkMemory';
import { WorkJournalHeader } from './WorkJournalHeader';

export function ColleagueWorkMemory({npcId}:{npcId:string}){
const {t,locale,memories}=useColleagueWorkMemory({npcId});

 return <section className="colleague-work-memory"><WorkJournalHeader kind="memory" title={t('journal.memoryJoke')} counts={[{label:'journal.results',value:memories.filter(m=>m.kind==='result').length},{label:'journal.replies',value:memories.filter(m=>m.kind==='reply').length}]}/><p>{t('workMemory.hint')}</p>{!memories.length&&<p>{t('workMemory.empty')}</p>}{memories.map(memory=><article key={memory.id} data-kind={memory.kind} data-boundary={memory.temporary||undefined}><header>{memory.kind==='reply'?<MessageSquare size={18}/>:<CheckCircle2 size={18}/>}<small>{t('workMemory.'+memory.kind)}</small>{memory.day!==undefined&&<time>{formatCalendarDate(memory.day,locale)}</time>}</header><h4>{t(memory.titleKey)}</h4><p><TermText>{t(memory.factKey)}</TermText></p>{memory.temporary&&<span><History size={14}/>{t('workMemory.boundary')} · {t('journal.boundary')}</span>}{memory.evidenceOnly&&<span>{t('workMemory.evidence')} · {t('journal.evidence')}</span>}</article>)}</section>;
}
