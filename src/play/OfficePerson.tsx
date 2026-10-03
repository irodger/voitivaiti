export function OfficePerson({avatarId,seated=false,walking=false}:{avatarId:string;seated?:boolean;walking?:boolean}) {
 const i=(Number(avatarId)||0)%6,column=i===1||i===5?1:i===2?2:i===3?3:0,row=walking?1:seated?2:0;
 return <span className={'office-person office-sprite'+(seated?' is-seated':'')} aria-hidden="true" style={{backgroundPosition:`${column/3*100}% ${row/2*100}%`}}/>;
}
