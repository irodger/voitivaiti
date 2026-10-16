import { CharacterAvatar } from '../components/CharacterAvatar';
import '../content/timeClarity';
import '../content/workScenePolish';
import { formatCalendarDate,formatTime } from '../utils/format';
import type { Step,StepProgress } from '../world/types';
import { characterName } from './shared';
import { useWorkReplyStatus } from './useWorkReplyStatus';
export function WorkReplyStatus({step,progress}:{step:Step;progress:StepProgress}){
const model=useWorkReplyStatus({step,progress});if(!model)return null;const {t,locale,dependency,npc,Icon}=model;

 return <aside className="work-reply-status" data-ready={dependency.ready||undefined}><header>{npc?<CharacterAvatar id={npc.avatarId} size={36}/>:<Icon size={22}/>}<div><small>{t(dependency.ready?'workPolish.ready':'workPolish.waiting')}</small><b>{npc?characterName(npc,t):t('ui.team')}</b></div><Icon size={18} aria-hidden="true"/></header><p>{dependency.ready?t('workPolish.received'):t('time.reply',{date:formatCalendarDate(dependency.dueDay,locale),time:formatTime(dependency.dueMinute)})}</p></aside>;
}
