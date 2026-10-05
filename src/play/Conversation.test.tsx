import {it,expect,vi} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {emptyCampaign,activeCharacter} from '../world/simulation';
import {transition} from '../world/engine';
let campaign=transition(emptyCampaign(),{type:'new',name:'Player',avatarId:'1',professionId:'frontend',seed:1427}).campaign;
vi.mock('../world/store',()=>({useWorld:(selector?: (s:typeof campaign)=>unknown)=>selector?selector(campaign):campaign}));
vi.mock('../content/localization',async original=>{const actual=await original<typeof import('../content/localization')>();return {...actual,useI18n:()=>({t:(key:string)=>key,locale:'ru'})};});
import {Conversation} from './Conversation';
import {availableTopics} from '../content/contextDialogue';
it('unanswered topics expose choices without revealing the colleague response',()=>{
 const topic=availableTopics(campaign,campaign.characters.find(x=>x.id==='anya')!).find(x=>x.id==='anya-work')!;
 const html=renderToStaticMarkup(<Conversation npcId="anya" initialTopicId={topic.id} onClose={()=>{}}/>);
 expect(html).toContain('conversation-reply-dock');expect(html).toContain(topic.choices[0].labelKey);expect(html).not.toContain(topic.choices[0].responseKey);expect(html).toContain('aria-pressed="true"');
});
it('a saved conversation shows the chosen response and cannot offer the same reward again',()=>{
 campaign=transition(campaign,{type:'conversation',npcId:'anya',topicId:'anya-work',choiceId:'ask'}).campaign;
 const entry=activeCharacter(campaign).dialogueHistory!['anya:anya-work'];
 const html=renderToStaticMarkup(<Conversation npcId="anya" initialTopicId="anya-work" onClose={()=>{}}/>);
 expect(html).toContain(entry.topic.choices.find(x=>x.id==='ask')!.responseKey);expect(html).toContain('teamChat.historyHint');expect(html).not.toContain('class="conversation-reply"');
});
