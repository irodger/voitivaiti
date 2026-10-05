import {it,expect,vi} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
vi.mock('../content/localization',async original=>{const actual=await original<typeof import('../content/localization')>();return {...actual,useI18n:()=>({t:actual.translate})};});
vi.mock('../world/store',async original=>{const actual=await original<typeof import('../world/store')>();const hook=Object.assign((selector?: (state:ReturnType<typeof actual.useWorld.getState>)=>unknown)=>selector?selector(actual.useWorld.getState()):actual.useWorld.getState(),actual.useWorld);return {...actual,useWorld:hook};});
import {FirstDay} from './FirstDay';
import {transition} from '../world/engine';
import {emptyCampaign,activeCharacter} from '../world/simulation';
import {useWorld} from '../world/store';
import {translate} from '../content/localization';
it('team introduction explains the scene and names the actual next destination',()=>{let c=transition(emptyCampaign(),{type:'new',name:'Intro',avatarId:'1',professionId:'frontend',seed:1427}).campaign;const f=activeCharacter(c).firstDay!;f.currentOnboardingStep='team';f.visited=['project'];useWorld.setState(c);let html=renderToStaticMarkup(<FirstDay/>);expect(html).toContain('team-intro-list');expect(html).toContain(translate('first.teamHelp'));expect(html).toContain(translate('first.toMeeting'));expect(html).not.toContain('aria-label="Поговорить:');f.visited=[];useWorld.setState(c);html=renderToStaticMarkup(<FirstDay/>);expect(html).toContain(translate('first.toProject'));});
it('Russian daily has a glossary link and explains its recurring nature',()=>{const c=transition(emptyCampaign(),{type:'new',name:'Intro',avatarId:'1',professionId:'frontend',seed:1427}).campaign;activeCharacter(c).firstDay!.currentOnboardingStep='meeting';useWorld.setState(c);const html=renderToStaticMarkup(<FirstDay/>);expect(html).toContain('Каждый рабочий день');expect(html).toContain('>дейли</button>');expect(translate('term.daily.title',{},'ru','clean')).toBe('Дейли');expect(translate('term.daily.title',{},'en','clean')).toBe('Daily');expect(translate('term.daily.explanation')).toContain('регулярная');});

import {FirstRunGuide} from './FirstRunGuide';
it('guides the actual first-day flow through reload without advancing it',()=>{
 let c=transition(emptyCampaign(),{type:'new',name:'Intro',avatarId:'1',professionId:'frontend',seed:1427}).campaign;
 const actions=[{type:'onboarding',name:'Player'},{type:'onboarding',choice:'project'},{type:'onboarding'},{type:'onboarding'},{type:'onboarding',choice:'curious'}] as const;
 for(const action of actions){useWorld.setState(c);const stage=activeCharacter(c).firstDay!.currentOnboardingStep;expect(renderToStaticMarkup(<FirstRunGuide/>)).toContain(translate('firstGuide.'+stage));c=transition(JSON.parse(JSON.stringify(c)),action).campaign;}
 useWorld.setState(c);expect(renderToStaticMarkup(<FirstRunGuide/>)).toContain(translate('firstGuide.brief'));
 c=transition(c,{type:'onboarding'}).campaign;c=transition(c,{type:'take-task'}).campaign;useWorld.setState(c);expect(renderToStaticMarkup(<FirstRunGuide/>)).toContain(translate('firstGuide.work'));
 activeCharacter(c).firstDay!.onboardingCompleted=true;useWorld.setState(c);expect(renderToStaticMarkup(<FirstRunGuide/>)).toBe('');
});
