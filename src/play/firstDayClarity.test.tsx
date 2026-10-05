import {it,expect,vi} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
vi.mock('../content/localization',async original=>{const actual=await original<typeof import('../content/localization')>();return {...actual,useI18n:()=>({t:actual.translate})};});
vi.mock('../world/store',async original=>{const actual=await original<typeof import('../world/store')>();const hook=Object.assign((selector?: (state:ReturnType<typeof actual.useWorld.getState>)=>unknown)=>selector?selector(actual.useWorld.getState()):actual.useWorld.getState(),actual.useWorld);return {...actual,useWorld:hook};});
import {FirstDay} from './FirstDay';
import {transition} from '../world/engine';
import {emptyCampaign,activeCharacter,activeTask} from '../world/simulation';
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

it('shows factual progress in either introduction order and keeps result in the work stage',()=>{
 for(const firstChoice of ['team','project']){
  let c=transition(emptyCampaign(),{type:'new',name:'Intro',avatarId:'1',professionId:'frontend',seed:1427}).campaign;
  c=transition(c,{type:'onboarding',name:'Player'}).campaign;c=transition(c,{type:'onboarding',choice:firstChoice}).campaign;
  useWorld.setState(c);let html=renderToStaticMarkup(<FirstRunGuide/>);expect(html).toContain('value="1"');expect(html).toContain('aria-current="step"');
  c=transition(c,{type:'onboarding'}).campaign;useWorld.setState(c);expect(renderToStaticMarkup(<FirstRunGuide/>)).toContain('value="1"');
  c=transition(c,{type:'onboarding'}).campaign;useWorld.setState(c);expect(renderToStaticMarkup(<FirstRunGuide/>)).toContain('value="2"');
  c.phase='reward';useWorld.setState(c);html=renderToStaticMarkup(<FirstRunGuide/>);expect(html).toContain('value="4"');expect(html).toContain(translate('firstGuide.result'));
 }
});

import {TaskBrief} from './TaskBrief';
it('opens the first task goal and reports completed stages and elapsed time from saved work',()=>{
 let c=transition(emptyCampaign(),{type:'new',name:'Intro',avatarId:'1',professionId:'frontend',seed:1427}).campaign;
 for(const action of [{type:'onboarding',name:'Player'},{type:'onboarding',choice:'team'},{type:'onboarding'},{type:'onboarding'},{type:'onboarding',choice:'ready'},{type:'onboarding'},{type:'take-task'}] as const)c=transition(c,action).campaign;
 useWorld.setState(c);let task=activeTask(c)!;let html=renderToStaticMarkup(<TaskBrief task={task}/>);expect(html).toContain('<details open=""');expect(html).toContain(translate('taskScene.act'));expect(html).toContain('value="0"');
 task.progress[task.currentStepId].status='completed';task.taskElapsedMinutes=23;c=JSON.parse(JSON.stringify(c));useWorld.setState(c);task=activeTask(c)!;html=renderToStaticMarkup(<TaskBrief task={task}/>);expect(html).toContain(translate('taskScene.checked'));expect(html).toContain(translate('ui.min',{value:23}));expect(html).toContain('value="1"');
 activeCharacter(c).firstDay!.onboardingCompleted=true;useWorld.setState(c);html=renderToStaticMarkup(<TaskBrief task={task}/>);expect(html).not.toContain('first-task-status');expect(html).not.toContain('<details open=""');
});

import {FirstEveningGuide} from './FirstEveningGuide';
it('keeps the first-evening guidance through reload and removes it after sleep',()=>{
 let c=transition(emptyCampaign(),{type:'new',name:'Intro',avatarId:'1',professionId:'frontend',seed:1427}).campaign;
 activeCharacter(c).firstDay!.currentOnboardingStep='farewell';c.schedule.forEach(event=>event.status='completed');
 c=transition(c,{type:'end-day'}).campaign;c=JSON.parse(JSON.stringify(c));useWorld.setState(c);
 let html=renderToStaticMarkup(<FirstEveningGuide/>);expect(html).toContain(translate('firstEvening.title'));expect(html).toContain(translate('firstEvening.sleep'));expect(html).toContain('aria-current="step"');expect(html).not.toContain('NaN');
 c=transition(c,{type:'sleep'}).campaign;useWorld.setState(c);expect(renderToStaticMarkup(<FirstEveningGuide/>)).toBe('');
 c.schedule.forEach(event=>event.status='completed');c=transition(c,{type:'end-day'}).campaign;useWorld.setState(c);expect(renderToStaticMarkup(<FirstEveningGuide/>)).toBe('');
});
