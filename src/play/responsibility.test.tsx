import {it,expect,vi} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
vi.mock('../world/store',async importOriginal=>{const actual=await importOriginal<typeof import('../world/store')>();return {...actual,useWorld:Object.assign((selector?: (s:ReturnType<typeof actual.useWorld.getState>)=>unknown)=>selector?selector(actual.useWorld.getState()):actual.useWorld.getState(),actual.useWorld)};});
import {useWorld} from '../world/store';
import {beginPlaytest} from '../world/playtestHelpers';
import {activeCharacter} from '../world/simulation';
import {PromotionCard} from './PromotionCard';
import {DelegationResults} from './DelegationResults';
it('explains review and mentoring routes and progress without a hidden required episode',()=>{
 const c=beginPlaytest('frontend');activeCharacter(c).careerNodeId='level-1';useWorld.setState(c);
 const html=renderToStaticMarkup(<PromotionCard nodeId="level-2"/>);
 expect(html).toContain('Как получить этот опыт');expect(html).toContain('Наставничество не единственный путь');
 expect(html).toContain('обычной задаче');expect(html).toContain('0 / 6');expect(html).not.toContain('90');
});
it('a returned result offers review responses, while an assignment offers no instant experience button',()=>{
 const c=beginPlaytest('frontend');c.company!.delegations=[{id:'d',actorId:c.activeCharacterId!,npcId:'ilya',work:'review',context:'payment',grade:2,profession:'frontend',startedDay:1,dueDay:3,status:'working'}];useWorld.setState(c);
 expect(renderToStaticMarkup(<DelegationResults/>)).toBe('');
 c.company!.delegations[0].status='returned';c.company!.delegations[0].result='verified';useWorld.setState(c);
 const html=renderToStaticMarkup(<DelegationResults/>);expect(html).toContain('Коллега вернулся с результатом');expect(html).toContain('Принять результат с указанными границами');expect(html).toContain('Вернуть на уточнение');
});
