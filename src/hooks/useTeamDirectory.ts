import {useState} from 'react';
import {useWorld} from '../world/store';
import {useI18n} from '../content/localization';
import {teamDirectory} from '../play/teamDirectory';
export function useTeamDirectory(){
 const world=useWorld(),{t}=useI18n();
 const [query,setQuery]=useState(''),[onlyNew,setOnlyNew]=useState(false),[profession,setProfession]=useState('all');
 const [selected,setSelected]=useState<{id:string;topic?:string}|null>(null);
 return {...teamDirectory(world,{query,onlyNew,profession},t),query,setQuery,onlyNew,profession,setProfession,selected,
  toggleNew:()=>setOnlyNew(value=>!value),reset:()=>{setQuery('');setProfession('all');setOnlyNew(false);},
  open:(id:string,topic?:string)=>setSelected({id,topic}),close:()=>setSelected(null)};
}
export type TeamDirectoryController=ReturnType<typeof useTeamDirectory>;
