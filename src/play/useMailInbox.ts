import { useTextSearch } from '../hooks/useTextSearch';
import { mailInboxModel, type MailFilter } from './mailInboxModel';
import { useState } from 'react';
import { useI18n } from '../content/localization';
import type { CompanyMailMessage } from '../world/companyMailTypes';
import { useWorld } from '../world/store';
import { mailWorkTarget } from './mailWorkTarget';
export function useMailInbox() {
  const w = useWorld();
  const { t } = useI18n();
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<MailFilter>('all');
  const { query, setQuery } = useTextSearch();
  const { messages, mail, unread, team, sender, thread, position, visibleThreads } = mailInboxModel(
    w,
    selected,
    filter,
    query,
    t,
  );
  const select = (m: CompanyMailMessage) => {
    setSelected(m.id);
    w.dispatch({ type: 'mail-read', id: m.id });
  };
  const target = mail ? mailWorkTarget(w, mail) : undefined;
  const problem = target?.problem;
  const resetFilters = () => {
    setQuery('');
    setFilter('all');
  };
  return {
    resetFilters,
    w,
    t,
    setSelected,
    filter,
    setFilter,
    query,
    setQuery,
    messages,
    mail,
    unread,
    team,
    sender,
    thread,
    position,
    visibleThreads,
    select,
    target,
    problem,
  };
}
