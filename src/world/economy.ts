import type { Character } from './types';
import { professionById } from '../content/professions';
import { homeUpgrades } from '../content/home';
// Game bands informed by Habr Career H1 2026; not reported grade medians.
const mid:Record<string,number>={frontend:180000,backend:220000,mobile:240000,qa:130000,'qa-automation':190000,designer:160000,'ux-research':150000,analyst:180000,'business-analyst':160000,product:200000,project:160000,delivery:190000,devops:230000,sre:240000,sysadmin:130000,security:180000,'data-analyst':160000,'data-engineer':220000,dba:200000,'solution-architect':280000,architect:300000,support:100000};
export const monthlySalary=(ch:Character)=>{const rank=Math.max(0,professionById[ch.profession].careers.findIndex(n=>n.id===ch.careerNodeId));return Math.round((mid[ch.profession]??160000)*([.5,1,1.45,1.8,2.1,2.25][rank]??2.25)/1000)*1000;};
export const dailySalary=(ch:Character)=>Math.round(monthlySalary(ch)/22);
export const homeState=(ch:Character)=>ch.home??{owned:[],eveningDay:0,paidDay:0,lastPay:0};
export const recovery=(ch:Character)=>({energy:65+homeUpgrades.filter(u=>homeState(ch).owned.includes(u.id)).reduce((n,u)=>n+u.energy,0)+(homeState(ch).owned.includes('router')?5:0),stress:Math.min(12,6+homeUpgrades.filter(u=>homeState(ch).owned.includes(u.id)).reduce((n,u)=>n+Math.min(2,u.stress),0)+(homeState(ch).owned.includes('headphones')?1:0))});
