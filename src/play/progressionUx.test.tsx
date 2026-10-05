import {it,expect,vi} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
vi.mock('../content/localization',async importOriginal=>{const actual=await importOriginal<typeof import('../content/localization')>();return {...actual,useI18n:()=>{const {locale,contentMode}=actual.usePreferences.getState();return {locale,contentMode,t:(key:string,values?:Record<string,string|number>)=>actual.translate(key,values,locale,contentMode)};}};});
vi.mock('../world/store',async importOriginal=>{const actual=await importOriginal<typeof import('../world/store')>();return {...actual,useWorld:Object.assign(()=>actual.useWorld.getState(),actual.useWorld)};});
import {useWorld} from '../world/store';
import {transition} from '../world/engine';
import {activeCharacter,emptyCampaign} from '../world/simulation';
import {WorkDesk} from './WorkDesk';
import {CareerVictory} from './CareerVictory';
import {translate,usePreferences} from '../content/localization';
function start(){const c=transition(emptyCampaign(),{type:'new',name:'Audit',avatarId:'1',professionId:'frontend',seed:1427}).campaign;delete activeCharacter(c).firstDay;activeCharacter(c).completedWork=['one','two','three'];c.schedule.forEach(e=>e.status='completed');c.life!.queue.forEach(q=>q.status=['bug','feature'].includes(q.id)?'done':'waiting');return c;}
it('the screenshot state has an explicit exit and explains inaccessible jobs in both languages',()=>{
 useWorld.setState(start());for(const locale of ['ru','en'] as const){usePreferences.setState({locale});const html=renderToStaticMarkup(<WorkDesk onResume={()=>{}} onOffice={()=>{}}/>);expect(html).toContain(translate('flow.empty'));expect(html).toContain(translate('flow.finish'));expect(html).toContain(translate('flow.locked',{count:3}));}usePreferences.setState({locale:'ru'});
});
it('victory offers new game plus and returning to the current hero, with honest legacy time',()=>{
 const c=start();activeCharacter(c).careerNodeId='level-3';delete activeCharacter(c).runTiming;useWorld.setState(c);const before=JSON.stringify(useWorld.getState().meta);
 for(const locale of ['ru','en'] as const){usePreferences.setState({locale});const html=renderToStaticMarkup(<CareerVictory onContinue={()=>{}} onClose={()=>{}}/>);expect(html).toContain(translate('flow.victory'));expect(html).toContain(translate('flow.plus'));expect(html).toContain(translate('flow.stay'));expect(html).toContain(translate('flow.unknown'));expect(html).not.toContain('flow.');}
 expect(JSON.stringify(useWorld.getState().meta)).toBe(before);expect(useWorld.getState().activeCharacterId).toBe(c.activeCharacterId);usePreferences.setState({locale:'ru'});
});
