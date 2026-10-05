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

function withCommitments(){
 campaign=transition(emptyCampaign(),{type:'new',name:'Player',avatarId:'1',professionId:'frontend',seed:1427}).campaign;
 const ch=activeCharacter(campaign);ch.firstDay!.onboardingCompleted=true;ch.completedWork=['one','two'];
 const bug=campaign.life!.queue.find(q=>q.id==='bug')!,feature=campaign.life!.queue.find(q=>q.id==='feature')!;
 bug.expectation={state:'waiting',dueDay:5};feature.expectation={state:'waiting',dueDay:6};bug.projectId=undefined;bug.problemId=undefined;
 return bug;
}
it('the teammate commitments screen shows only their own work and a route to the laptop',()=>{
 withCommitments();const html=renderToStaticMarkup(<Conversation npcId="max" onWork={()=>{}} onClose={()=>{}}/>);
 expect(html).toContain('teamChat.commitments');expect(html).toContain('life.work.bug');expect(html).not.toContain('life.work.feature');expect(html).toContain('teamChat.openWork');expect(html).toContain('expect.postpone');expect(html).toContain('ui.min');
});
it('home conversations cannot negotiate deadlines or offer office work navigation',()=>{
 withCommitments();campaign.phase='home';const html=renderToStaticMarkup(<Conversation npcId="max" onWork={()=>{}} onClose={()=>{}}/>);
 expect(html).toContain('teamChat.officeOnly');expect(html).not.toContain('expect.postpone');expect(html).not.toContain('teamChat.openWork');
});
it('an already used extension cannot be offered again in conversation',()=>{
 const bug=withCommitments();bug.expectation!.extensionUsed=true;
 const html=renderToStaticMarkup(<Conversation npcId="max" onClose={()=>{}}/>);
 expect(html).not.toContain('expect.postpone');expect(html).not.toContain('expect.blocker');expect(html).toContain('expect.defer');
});
