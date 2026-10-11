import {Network,Box,Megaphone,ArrowRight,ShieldCheck,Layers,Users} from 'lucide-react';
import '../content/companyEngine';
import {useI18n} from '../content/localization';
import type {Company,Character} from '../world/types';
import {characterName} from './shared';
import './companyStructure.css';
export function CompanyStructure({company,characters}:{company:Company;characters:Character[]}){
 const {t}=useI18n(),org=company.structure;if(!org)return null;
 const teamName=(id:string)=>t(org.teams.find(team=>team.id===id)!.nameKey);
 return <section className="company-structure" aria-labelledby="company-structure-title"><header><Network size={23}/><div><p className="eyebrow">{t('org.type.'+org.type)} · {t(org.industryKey)}</p><h2 id="company-structure-title">{t('org.title')}</h2></div></header>
 <div className="company-product"><Box size={23}/><div><small>{t('org.product')}</small><h3>{t(org.product.nameKey)}</h3><p>{t(org.product.purposeKey)}</p></div></div>
 <div className="company-departments">{org.departments.map(dept=><article key={dept.id}><h3><Users size={17}/>{t(dept.nameKey)}</h3><ul>{dept.teamIds.map(id=>{const team=org.teams.find(team=>team.id===id)!,contact=characters.find(ch=>ch.id===team.contactId),Icon=team.owns.includes('access')?ShieldCheck:Layers;return <li key={id}><header><Icon size={18}/><b>{t(team.nameKey)}</b></header><p>{t(team.purposeKey)}</p><small>{t('org.ownership')}: {team.owns.map(id=>t('org.owns.'+id)).join(' · ')}</small>{team.dependsOn.length>0&&<div className="company-team-dependencies"><span>{t('org.depends')}</span>{team.dependsOn.map(id=><span key={id}><ArrowRight size={12}/>{teamName(id)}</span>)}</div>}<small className="company-team-contact">{contact?characterName(contact,t):t('org.contact')}</small></li>;})}</ul></article>)}</div>
 <aside className="company-campaign"><Megaphone size={22}/><div><b>{teamName(org.campaign.sourceTeamId)} <ArrowRight size={14}/> {teamName(org.campaign.targetTeamId)}</b><small>{t('ui.day',{day:org.campaign.launchedDay??org.campaign.plannedDay})}</small><p>{t('org.campaign.'+(org.campaign.state==='planned'?'planned':'launched'))}</p>{org.campaign.problemId&&<a href={'#company-problem-'+org.campaign.problemId}>{t('org.campaign.title')} <ArrowRight size={14}/></a>}</div></aside>
 </section>;
}
