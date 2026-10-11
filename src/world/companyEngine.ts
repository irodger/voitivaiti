import '../content/companyEngine';
import {nextWorkdayOnOrAfter,isWorkday} from './calendar';
import type {Campaign,Company,Character,Problem,Task,TaskTemplate} from './types';
import type {CompanyStructure} from './companyEngineTypes';
export function createCompanyStructure(company:Company):CompanyStructure{
 const prefix=company.id+':team:',department=(id:string)=>company.id+':department:'+id;
 const specs=[['product','product',['web','api'],['payments','security','platform'],'product'],['payments','foundation',['payment'],['platform','security'],'backend'],['security','foundation',['access'],['platform'],'security'],['platform','foundation',['infrastructure'],[],'sre'],['sales','growth',['sales'],['product'],'business-analyst'],['marketing','growth',['campaigns'],['product','platform'],'product'],['support','operations',['support'],['product','payments'],'support']] as const;
 const teams=specs.map(([id,dept,owns,dependsOn,profession])=>({id:prefix+id,departmentId:department(dept),nameKey:'org.team.'+id,purposeKey:'org.purpose.'+id,owns:[...owns],dependsOn:dependsOn.map(id=>prefix+id),contactProfession:profession}));
 const type=company.processMaturity>70?'established':company.processMaturity<40?'studio':'growing';
 return {version:1,type,industryKey:'project.'+company.archetype+'.type',product:{projectId:company.projects[0].id,nameKey:company.projects[0].nameKey,purposeKey:'org.product.purpose'},departments:['product','foundation','growth','operations'].map(id=>({id:department(id),nameKey:'org.department.'+id,teamIds:teams.filter(t=>t.departmentId===department(id)).map(t=>t.id)})),teams,campaign:{id:company.id+':campaign:launch',sourceTeamId:prefix+'marketing',targetTeamId:prefix+'platform',plannedDay:nextWorkdayOnOrAfter(8+(company.seed>>>0)%4),state:'planned'}};
}
/** Launch once from a saved plan. No employee generation or numeric balance effects. */
export function advanceCompanyStructure(c:Campaign){
 const company=c.company,org=company?.structure,day=c.life?.calendarDay;if(!company||!org||day===undefined||!isWorkday(day)||org.campaign.state!=='planned'||day<org.campaign.plannedDay)return;
 const project=company.projects.find(p=>p.id===org.product.projectId);if(!project)return;
 const id=org.campaign.id+':capacity',eventId=org.campaign.id+':risk';
 let p=project.problems.find(p=>p.id===id);
 if(!p){p={id,titleKey:'org.campaign.title',category:'performance',ownerTeamId:org.campaign.targetTeamId,affectedSystems:['web','api'],rootCause:'unverified campaign capacity',severity:3,discovered:true,status:'planned',contributions:[],history:[]};project.problems.push(p);}
 const event={id:eventId,day,kind:'marketing-campaign',key:'org.campaign.launched',projectId:project.id,problemId:id,values:{sourceTeamId:org.campaign.sourceTeamId,ownerTeamId:org.campaign.targetTeamId,productProjectId:project.id}};
 if(!company.history.some(e=>e.id===eventId)){company.history.push(event);project.history.push(event);p.history.push(event);}
 p.latestOutcomeKey=event.key;org.campaign.state='launched';org.campaign.problemId=id;org.campaign.launchedDay=day;
}
/** Materialize a single contact only on an actual assignment involving this team. */
export function encounterTeam(c:Campaign,teamId:string,create:(id:string,name:string,avatar:string,profession:string)=>Character){
 const team=c.company?.structure?.teams.find(t=>t.id===teamId);if(!team)return;
 const existing=c.characters.find(ch=>ch.id===team.contactId);if(existing)return existing;
 const id=team.id+':contact',index=c.company!.structure!.teams.indexOf(team),nameIndex=((c.company!.seed>>>0)+index)%18;
 const marketing=team.id===c.company!.structure!.campaign.sourceTeamId;
 const contact=create(id,marketing?'npc.org.marketing.name':'roster.name.'+nameIndex,marketing||nameIndex%2===0?'1':'0',team.contactProfession);contact.playable=false;contact.currentProjectIds=[c.company!.structure!.product.projectId];team.contactId=id;c.characters.push(contact);if(!c.company!.employeeIds.includes(id))c.company!.employeeIds.push(id);return contact;
}
export function prepareCampaignWork(c:Campaign,task:Task,base:TaskTemplate,problem:Problem,create:(id:string,name:string,avatar:string,profession:string)=>Character){
 if(problem.id!==c.company?.structure?.campaign.problemId||task.encounter?.triggerId!==c.company.structure.campaign.id+':risk')return;
 const contact=encounterTeam(c,c.company.structure.campaign.sourceTeamId,create),scene=structuredClone(base);if(contact){scene.author=contact.id;if(task.encounter)task.encounter.previousActorId=contact.id;}
 scene.titleKey=problem.titleKey;scene.descriptionKey='org.campaign.launched';scene.steps[0].titleKey='org.campaign.forecast';scene.steps[0].bodyKey='org.campaign.launched';if(contact)scene.steps[0].speaker=contact.id;task.sceneFamily='investigation';
 const inspect=scene.steps[0].actionFlow?.actions.find(a=>a.id==='inspect'),trace=scene.steps[0].actionFlow?.actions.find(a=>a.id==='trace');
 if(inspect){inspect.observationKey='org.campaign.observation';inspect.artifact={kind:'metrics',titleKey:'org.campaign.forecast',promptKey:'org.campaign.prompt',rows:[{id:'forecast',labelKey:'org.campaign.plannedTraffic',detailKey:'org.campaign.plannedTraffic.data'},{id:'capacity',labelKey:'org.campaign.capacity',detailKey:'org.campaign.capacity.data'}]};}
 if(trace){trace.labelKey='org.campaign.trace';trace.observationKey='org.campaign.trace.result';trace.artifact=undefined;}
 const handoff=scene.steps.flatMap(s=>s.actionFlow?.actions??[]).find(a=>a.id==='handoff');if(handoff)handoff.labelKey='org.campaign.handoff';
 task.scene=scene;
}
