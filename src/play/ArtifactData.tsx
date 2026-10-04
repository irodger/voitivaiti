import {useI18n} from '../content/localization';
import {TermText} from './TermText';
import type {WorkArtifact} from '../world/types';
export function ArtifactData({row,kind}:{row:WorkArtifact['rows'][number];kind?:string}){
 const {t}=useI18n(),max=Math.max(1,...(row.trend??[]).map(point=>point.value));
 return <>{kind==='code'&&row.id==='source'?<pre className="artifact-source"><code><TermText>{t(row.detailKey)}</TermText></code></pre>:<TermText>{t(row.detailKey)}</TermText>}{row.trend&&<figure className="artifact-trend"><figcaption>{t(row.labelKey)} · {t('measurement.scale')}</figcaption><ol>{row.trend.map(point=><li key={point.label}><span>{point.label}</span><i aria-hidden="true" style={{width:Math.max(0,point.value)/max*100+'%'}}/><b>{point.value} {t('measurement.unit')}</b></li>)}</ol></figure>}</>;
}
