import { TermText } from './TermText';
import { useEffect,useRef,type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight,X } from 'lucide-react';
import { useI18n } from '../content/localization';
import { useWorld } from '../world/store';
import { professionById } from '../content/professions';
import { CharacterAvatar } from '../components/CharacterAvatar';
import type { Character } from '../world/types';
export function Button({children,onClick,disabled=false,secondary=false}:{children:ReactNode;onClick?:()=>void;disabled?:boolean;secondary?:boolean}){return <motion.button whileTap={{scale:.98}} disabled={disabled} onClick={onClick} className={secondary?'world-secondary':'primary-button'}>{children}{!secondary&&<ArrowRight size={18}/>}</motion.button>}
export function Modal({title,children,onClose}:{title:string;children:ReactNode;onClose:()=>void}){const ref=useRef<HTMLDialogElement>(null),{t}=useI18n();useEffect(()=>{ref.current?.showModal();return()=>ref.current?.close();},[]);return <dialog ref={ref} className="modal world-modal" onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose();}}><div className="modal-heading"><h2>{title}</h2><button className="icon-button" aria-label={t('ui.close')} onClick={onClose}><X size={20}/></button></div>{children}</dialog>}
export function characterName(ch:Character,t:(key:string)=>string){return ch.name.startsWith('roster.')||ch.name.startsWith('npc.')?t(ch.name):ch.name;}
export function Speech({speaker='sergey',children}:{speaker?:string;children:ReactNode}){const {t}=useI18n(),ch=useWorld(s=>s.characters.find(c=>c.id===speaker));return <div className="speech"><CharacterAvatar id={ch?.avatarId??'3'} size={44}/><div><div className="speaker">{ch?characterName(ch,t):t('ui.npcName')}<span>{ch?t(professionById[ch.profession].careers.find(n=>n.id===ch.careerNodeId)!.titleKey):''}</span></div><p>{typeof children==='string'?<TermText>{children}</TermText>:children}</p></div></div>}
export function Code({text,error=false}:{text:string;error?:boolean}){return <div className={`code-mock ${error?'error-code':''}`}><div className="code-top"><span className="window-dots">● ● ●</span><span>{error?'Console':'source'}</span></div><pre><code>{text}</code></pre></div>}
export const formatTime=(n:number)=>`${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;

