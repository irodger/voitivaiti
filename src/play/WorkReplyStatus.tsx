import {Clock3,CheckCircle2} from 'lucide-react';
import {CharacterAvatar} from '../components/CharacterAvatar';
import {useWorld} from '../world/store';
import {useI18n} from '../content/localization';
import {characterName} from './shared';
import {formatCalendarDate,formatTime} from '../utils/format';
import type {Step,StepProgress} from '../world/types';
import '../content/timeClarity';
import '../content/workScenePolish';
export function WorkReplyStatus({step,progress}:{step:Step;progress:StepProgress}){
 const {t,locale}=useI18n(),characters=useWorld(s=>s.characters),dependency=progress.dependency;
 const inspected=progress.actionHistory?.some(id=>step.actionFlow?.actions.some(a=>a.id===id&&a.requiresReply));
 if(!dependency||progress.status==='completed'||inspected)return null;
 const npc=characters.find(c=>c.id===dependency.npcId),Icon=dependency.ready?CheckCircle2:Clock3;
 return <aside className="work-reply-status" data-ready={dependency.ready||undefined}><header>{npc?<CharacterAvatar id={npc.avatarId} size={36}/>:<Icon size={22}/>}<div><small>{t(dependency.ready?'workPolish.ready':'workPolish.waiting')}</small><b>{npc?characterName(npc,t):t('ui.team')}</b></div><Icon size={18} aria-hidden="true"/></header><p>{dependency.ready?t('workPolish.received'):t('time.reply',{date:formatCalendarDate(dependency.dueDay,locale),time:formatTime(dependency.dueMinute)})}</p></aside>;
}
