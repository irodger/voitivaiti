import {Activity,Layers,Handshake,Star,History} from 'lucide-react';
import '../content/companyPage';
import {useWorld} from '../world/store';
import {useI18n} from '../content/localization';
import {characterName} from './shared';
import {CompanyLogo} from './CompanyLogo';
import {CompanyProject} from './CompanyProject';
import './companyPage.css';
const metrics=[{id:'techDebt',hint:'debt',Icon:Layers,lower:true},{id:'stability',hint:'stability',Icon:Activity},{id:'processMaturity',hint:'process',Icon:Handshake},{id:'reputation',hint:'reputation',Icon:Star}] as const;
export function Company(){
 const w=useWorld(),co=w.company!,{t}=useI18n(),events=[...co.history].reverse();
 const eventRows=(rows:typeof events)=>rows.map(h=>{const actor=w.characters.find(c=>c.id===h.actorId);return <li key={h.id}><small>{t('ui.day',{day:h.day})}</small><div><b>{t(h.key)}</b>{actor&&<span>{characterName(actor,t)}</span>}</div></li>;});
 return <section className="collection-view world-collection company-page"><header className="company-identity"><CompanyLogo company={co}/><div><p className="eyebrow">{t('companyPage.employer')}</p><h1>{t(co.nameKey)}</h1><div className="company-tags"><span>{t('culture.'+co.culture)}</span><span>{t('stage.'+co.stage)}</span></div></div></header>
 <section className="company-overview"><h2>{t('companyPage.overview')}</h2><p className="fine-print">{t('companyPage.scope')}</p><div className="company-metric-grid">{metrics.map(m=>{const value=co[m.id],good=m.id==='techDebt'?100-value:value;return <article key={m.id} className={good<40?'needs-attention':''}><m.Icon size={21}/><small>{t('ui.'+m.id)}</small><b>{value}<span>/100</span></b><div className="company-meter" aria-hidden="true"><i style={{width:Math.max(0,Math.min(100,value))+'%'}}/></div><small>{t('companyPage.'+(m.id==='techDebt'?'lower':'higher'))}</small><p>{t('companyPage.'+m.hint)}</p></article>;})}</div></section>
 <h2>{t('companyPage.projects')}</h2><div className="project-grid">{co.projects.map(p=><CompanyProject key={p.id} project={p}/>)}</div>
 <section className="company-timeline"><h2><History size={21}/>{t('companyPage.history')}</h2>{events.length?<><ol>{eventRows(events.slice(0,10))}</ol>{events.length>10&&<details><summary>{t('companyPage.older')}</summary><ol>{eventRows(events.slice(10))}</ol></details>}</>:<p>{t('companyPage.none')}</p>}</section></section>;
}
