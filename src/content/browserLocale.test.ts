import {it,expect,vi,afterEach} from 'vitest';
import {browserLocale} from './browserLocale';
afterEach(()=>{vi.unstubAllGlobals();vi.resetModules();});
it('uses the primary browser language, with English as the unsupported-language fallback',()=>{
 expect(browserLocale(['ru-RU','en-US'])).toBe('ru');
 expect(browserLocale(['RU','en'])).toBe('ru');
 expect(browserLocale(['en-GB','ru'])).toBe('en');
 expect(browserLocale(['de-DE','ru'])).toBe('en');
 expect(browserLocale([])).toBe('en');
});
it('keeps a saved manual choice above the browser default and retains other preferences',async()=>{
 vi.stubGlobal('window',{});vi.stubGlobal('navigator',{languages:['en-US'],language:'en-US'});
 const saved={state:{locale:'ru',colorScheme:'violet',soundEnabled:false},version:0};
 vi.stubGlobal('localStorage',{getItem:()=>JSON.stringify(saved),setItem:()=>{},removeItem:()=>{}});
 vi.stubGlobal('window',{localStorage});
 const {usePreferences}=await import('./localization');
 expect(usePreferences.getState()).toMatchObject({locale:'ru',colorScheme:'violet',soundEnabled:false});
});
it('starts a fresh browser in English and persists a manual switch',async()=>{
 vi.stubGlobal('window',{});vi.stubGlobal('navigator',{languages:['en-US'],language:'en-US'});
 const writes:string[]=[];vi.stubGlobal('localStorage',{getItem:()=>null,setItem:(_key:string,value:string)=>writes.push(value),removeItem:()=>{}});
 vi.stubGlobal('window',{localStorage});
 const {usePreferences}=await import('./localization');expect(usePreferences.getState().locale).toBe('en');
 usePreferences.getState().setLocale('ru');expect(JSON.parse(writes.at(-1)!).state.locale).toBe('ru');
});
