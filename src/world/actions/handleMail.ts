import { readCompanyMail, markCompanyMailUnread } from '../companyMail';
import { makeCharacter } from '../simulation';
import type { ActionContext } from './context';
import type { Action } from './types';
export function handleMail({ c, source, feedback }: ActionContext, action: Action) {
  if (action.type === 'mail-read')
    return { campaign: readCompanyMail(c, action.id, makeCharacter) ? c : source, feedback };
  if (action.type === 'mail-unread')
    return { campaign: markCompanyMailUnread(c, action.id) ? c : source, feedback };
}
