import {useTeamDirectory} from '../hooks/useTeamDirectory';
import {useI18n} from '../content/localization';
import {Conversation} from './Conversation';
import {TeamBanner} from './TeamBanner';
import {TeamHighlights} from './TeamHighlights';
import {TeamFilters} from './TeamFilters';
import {TeamMemberCard} from './TeamMemberCard';
import './spaces.css';
import './team.css';
import '../content/expectations';
import '../content/teamChat';
import '../content/workspaceUx';
import '../content/teamView';
export function Team({onWork}:{onWork?:()=>void}={}){
 const {t}=useI18n(),directory=useTeamDirectory();
 return <section className="collection-view world-collection team-view">
  <TeamBanner directory={directory}/><TeamHighlights directory={directory} onWork={onWork} onTalk={directory.open}/>
  {!directory.people.length&&<p>{t('teamView.empty')}</p>}
  <TeamFilters directory={directory}/>
  <div className="team-roster">{directory.visible.map(member=><TeamMemberCard key={member.person.id} member={member} onTalk={directory.open}/>)}</div>
  {directory.selected&&<Conversation onWork={onWork} key={directory.selected.id} initialTopicId={directory.selected.topic} npcId={directory.selected.id} onClose={directory.close}/>}
 </section>;
}
