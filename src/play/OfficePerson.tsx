import {useId} from 'react';
/** A full-body counterpart of the existing avatar palette, with animated limbs. */
export function OfficePerson({avatarId}:{avatarId:string}) {
 const n=Number(avatarId)||0,i=n%6,variant=Math.floor(n/6)%4,id=useId().replaceAll(':','');
 const shirt=['#506e5c','#c16f54','#7c80a7','#b99a50','#537b91','#a06380'][i];
 const skin=['#edb98f','#f2c3a6','#b87c5b','#e6ab80','#d29b73','#efba98'][i];
 const hair=variant===2?'#b5b2aa':i===1?'#794834':i===3?'#695a4d':'#34332f';
 return <svg className="office-person" viewBox="0 0 64 112" aria-hidden="true">
  <defs><linearGradient id={id}><stop stopColor={shirt}/><stop offset="1" stopColor="#263b35"/></linearGradient></defs>
  <ellipse className="person-shadow" cx="32" cy="106" rx="23" ry="5" fill="#233b32" opacity=".25"/>
  <g className="person-leg left"><path d="M25 72 23 98" stroke="#3b4143" strokeWidth="11" strokeLinecap="round"/><path d="M23 98 16 101" stroke="#ece6d6" strokeWidth="9" strokeLinecap="round"/></g>
  <g className="person-leg right"><path d="M39 72 42 98" stroke="#333a3c" strokeWidth="11" strokeLinecap="round"/><path d="M42 98 48 101" stroke="#ded7c6" strokeWidth="9" strokeLinecap="round"/></g>
  <path d="M18 47Q32 39 46 47L49 75Q32 83 15 75Z" fill={`url(#${id})`}/>
  <g className="person-arm left"><path d="M18 50 11 73" stroke={shirt} strokeWidth="10" strokeLinecap="round"/><circle cx="11" cy="77" r="5" fill={skin}/></g>
  <g className="person-arm right"><path d="M46 50 53 72" stroke={shirt} strokeWidth="10" strokeLinecap="round"/><circle cx="53" cy="76" r="5" fill={skin}/></g>
  <path d="M27 36v10q5 7 10 0V36" fill={skin}/>
  <g className="person-head">
   {(i===1||i===5)&&<path d="M13 47V20Q12 1 32 2Q54 1 52 25V48Z" fill={hair}/>}
   <ellipse cx="32" cy="24" rx="18" ry="21" fill={skin}/>
   <path d="M14 23Q8 0 32 2Q56-1 50 23L44 14Q31 24 20 17L17 28Z" fill={hair}/>
   <circle cx="25" cy="25" r="2" fill="#30332e"/><circle cx="39" cy="25" r="2" fill="#30332e"/>
   <path d="M29 35q4 3 8 0" stroke="#a2634b" strokeWidth="2" fill="none" strokeLinecap="round"/>
   {(i===0||i===4||variant===1)&&<g fill="none" stroke="#363d37" strokeWidth="2"><rect x="18" y="20" width="12" height="10" rx="3"/><rect x="34" y="20" width="12" height="10" rx="3"/><path d="M30 24h4"/></g>}
   {i===3&&<path d="M17 31Q21 46 32 44Q45 45 48 31L38 37H26Z" fill={hair} opacity=".8"/>}
  </g>
 </svg>;
}
