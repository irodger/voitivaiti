import {it,expect,vi} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {emptyCampaign,activeCharacter} from '../world/simulation';
import {transition} from '../world/engine';
let campaign=transition(emptyCampaign(),{type:'new',name:'Promotion',avatarId:'1',professionId:'frontend',seed:1427}).campaign;
vi.mock('../world/store',()=>({useWorld:()=>campaign}));
vi.mock('../content/localization',async original=>{const actual=await original<typeof import('../content/localization')>();return {...actual,useI18n:()=>({t:(key:string,values?:Record<string,unknown>)=>key+(values?JSON.stringify(values):''),locale:'ru'})};});
import {PromotionRequirements} from './PromotionRequirements';
it('a warning shows the real level and remaining streak, without a boolean 0/1',()=>{
 activeCharacter(campaign).reviewStage=2;campaign.life!.goodDays=1;
 const html=renderToStaticMarkup(<PromotionRequirements nodeId="level-1" onWork={()=>{}}/>);
 expect(html).toContain('promotionClarity.blocked');expect(html).toContain('&quot;level&quot;:2');expect(html).toContain('&quot;days&quot;:2');expect(html).toContain('promotionClarity.levels');expect(html).toContain('promotionClarity.work');expect(html).not.toContain('0 / 1');
});
it('unknown warning origins are disclosed instead of invented',()=>{
 activeCharacter(campaign).reviewStage=1;campaign.life!.decisionHistory=[];
 const html=renderToStaticMarkup(<PromotionRequirements nodeId="level-1"/>);
 expect(html).toContain('promotionClarity.unknown');expect(html).not.toContain('promotionClarity.issues');
});
it('recorded recent issues are separate from the recovery rule',()=>{
 campaign.life!.decisionHistory=[{day:campaign.life!.calendarDay,kind:'riskyDeploys'}];
 const html=renderToStaticMarkup(<PromotionRequirements nodeId="level-1"/>);
 expect(html).toContain('promotionClarity.issues');expect(html).toContain('life.riskyDeploys');expect(html).toContain('promotionClarity.rule');
});
