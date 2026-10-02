import type {CSSProperties} from 'react';

const cells:Record<string,string>={monitor:'0% 0%',keyboard:'100% 0%',headphones:'0% 100%',router:'100% 100%'};
export function TechArt({id,label}:{id:string;label?:string}){
 return <span className="tech-art" role={label?'img':undefined} aria-label={label} aria-hidden={label?undefined:true} style={{backgroundImage:`url(${import.meta.env.BASE_URL}art/tech-premium.webp)`,backgroundPosition:cells[id]??'0% 0%'} as CSSProperties}/>;
}
