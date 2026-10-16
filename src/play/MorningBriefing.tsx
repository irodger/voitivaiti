import { Clock3,MessageSquare } from 'lucide-react';
import '../content/morningBriefing';
import { formatCalendarDate } from '../utils/format';
import './morningBriefing.css';
import { TermText } from './TermText';
import { useMorningBriefing } from './useMorningBriefing';
import { WorkJournalHeader } from './WorkJournalHeader';

export function MorningBriefing(){
const model=useMorningBriefing();if(!model)return null;const {t,locale,brief}=model;

 return <section className="morning-brief"><WorkJournalHeader kind="morning" title={t('morningBrief.title')} counts={[{label:'journal.updates',value:brief.items.length},{label:'journal.due',value:brief.deadlines.length}]}/><p>{t('morningBrief.from',{date:formatCalendarDate(brief.calendarDay,locale),count:brief.delivered})}</p>{brief.items.length?<details><summary><MessageSquare size={16}/>{brief.items.length===1?t('morningBrief.'+brief.items[0].kind):t('desk.colleagues')} · {brief.items.length}</summary>{brief.items.map(item=><article key={item.id}><small>{t('morningBrief.'+item.kind)}</small><b>{t(item.titleKey)}</b>{item.factKey&&<p><TermText>{t(item.factKey)}</TermText></p>}</article>)}</details>:<p>{t('morningBrief.none')}</p>}{brief.deadlines.length>0&&<details><summary><Clock3 size={16}/>{t('morningBrief.deadlines')} · {brief.deadlines.length}</summary>{brief.deadlines.map(item=><article key={item.id}><b>{t(item.titleKey)}</b><small>{t('morningBrief.'+(item.overdue?'overdue':'today'))}</small></article>)}</details>}<p>{t('morningBrief.hint')}</p></section>;
}
