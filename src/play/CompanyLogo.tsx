import {Blocks,Landmark,Network} from 'lucide-react';
import type {Company} from '../world/types';
export function CompanyLogo({company}:{company:Company}){
 const bank=company.nameKey==='company.bank',scale=company.nameKey==='company.scale',Icon=bank?Landmark:scale?Network:Blocks;
 const variant=Math.abs(company.seed)%3;
 return <span className={'company-logo '+(bank?'bank':scale?'scale':'studio')+' variant-'+variant} aria-hidden="true"><span className="company-logo-orbit"/><Icon size={38} strokeWidth={1.6}/><i className="company-logo-accent"/></span>;
}
