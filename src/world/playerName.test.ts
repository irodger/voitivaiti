import {beforeEach,it,expect,vi} from 'vitest';
const saved=new Map<string,string>();vi.stubGlobal('localStorage',{getItem:(k:string)=>saved.get(k)??null,setItem:(k:string,v:string)=>saved.set(k,v),removeItem:(k:string)=>saved.delete(k)});
import {lastPlayerName} from './playerName';
import {useWorld} from './store';
import {emptyCampaign,activeCharacter} from './simulation';
beforeEach(()=>{saved.clear();useWorld.setState(emptyCampaign());});
it('remembers only confirmed names, preserves across reset and lets the next player change it',()=>{const w=useWorld.getState();w.dispatch({type:'new',name:'Новый коллега',avatarId:'1',professionId:'frontend',seed:1427});expect(lastPlayerName()).toBe('');w.dispatch({type:'onboarding',name:'  Лена  '});expect(lastPlayerName()).toBe('Лена');w.reset();expect(lastPlayerName()).toBe('Лена');w.begin();w.dispatch({type:'new',name:'Новый коллега',avatarId:'1',professionId:'qa',seed:1427});expect(lastPlayerName()).toBe('Лена');w.dispatch({type:'onboarding',name:'Алекс'});expect(activeCharacter(useWorld.getState()).name).toBe('Алекс');w.dispatch({type:'rename',name:'Саша'});w.reset();expect(lastPlayerName()).toBe('Саша');});
it('uses a name from an older saved campaign without requiring onboarding again',()=>{saved.set('voiti-vaiti-campaign',JSON.stringify({state:{activeCharacterId:'old',characters:[{id:'old',name:'Марина'}]}}));expect(lastPlayerName()).toBe('Марина');});
