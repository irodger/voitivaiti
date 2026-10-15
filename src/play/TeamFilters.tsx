import {Search,Sparkles} from 'lucide-react';
import type {TeamDirectoryController} from '../hooks/useTeamDirectory';
import {professionById} from '../content/professions';
import {useI18n} from '../content/localization';
import '../content/teamView';
export function TeamFilters({directory}:{directory:TeamDirectoryController}){
 const {t}=useI18n(),{query,setQuery,profession,setProfession,people,onlyNew,toggleNew,topics,visible,reset}=directory;
 return <>
  <div className="team-tools">
  <label className="team-search">
  <Search size={18}/>
  <input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t('teamView.search')} aria-label={t('teamView.search')}/>
  </label>
  <select value={profession} onChange={e=>setProfession(e.target.value)} aria-label={t('workspace.roleFilter')}>
  <option value="all">{t('teamView.all')}</option>{[...new Set(people.map(c=>c.profession))].map(id=>
  <option key={id} value={id}>{t(professionById[id].titleKey)}</option>)}</select>
  <button className="world-secondary" aria-pressed={onlyNew} onClick={toggleNew}>
  <Sparkles size={15}/> {t('teamView.fresh')} · {topics}</button>
  </div>{!!people.length&&!visible.length&&<div className="team-empty">
  <p>{t('teamView.nothing')}</p>
  <button className="world-secondary" onClick={reset}>{t('teamView.reset')}</button>
  </div>}</>;
}
