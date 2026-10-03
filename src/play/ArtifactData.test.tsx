import {it,expect,vi} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
vi.mock('../content/localization',async original=>{const actual=await original<typeof import('../content/localization')>();return {...actual,useI18n:()=>({t:actual.translate})};});
import {ArtifactData} from './ArtifactData';
import {measurementArtifact} from '../content/measurementArtifacts';
it('measurements remain readable without color or interpreting bar heights',()=>{const html=renderToStaticMarkup(<ArtifactData row={measurementArtifact().rows[0]}/>);expect(html).toContain('09:30');expect(html).toContain('2400');expect(html).toContain('800');expect(html).toContain('<ol>');expect(html).toContain('aria-hidden="true"');});
