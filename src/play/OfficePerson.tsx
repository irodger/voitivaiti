export function OfficePerson({avatarId,seated=false,walking=false,rear=false,facing='left'}:{avatarId:string;seated?:boolean;walking?:boolean;rear?:boolean;facing?:'left'|'right'}) {
 const i=(Number(avatarId)||0)%6,column=i===1||i===5?1:i===2?2:i===3?3:0,row=walking?1:seated?2:0;
 if(walking)return <span className={"office-person office-sprite walk-cycle"+(rear?" walk-rear":"")} aria-hidden="true" style={{'--walk-x':`${column/3*100}%`,transform:facing==='left'?'scaleX(-1)':undefined} as React.CSSProperties}/>;
 return <span className={'office-person office-sprite'+(seated?' is-seated':'')} aria-hidden="true" style={{transform:seated&&facing==='right'?'scaleX(-1)':undefined,backgroundPosition:`${column/3*100}% ${row/2*100}%`}}/>;
}
