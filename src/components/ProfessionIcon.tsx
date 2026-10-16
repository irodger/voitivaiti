import { useId } from 'react';
import {
  PanelsTopLeft, ServerCog, SmartphoneNfc, ShieldCheck, Bot, PenTool, ScanSearch,
  Workflow, Scale, Target, Map, Flag, Container, Activity, KeyRound, Shield,
  ChartNoAxesCombined, Network, Database, Blocks, Castle, Headset,
} from 'lucide-react';
import './professionIcon.css';

export const professionEmblems = {
  frontend: { Symbol: PanelsTopLeft, color: '#53c4ed' },
  backend: { Symbol: ServerCog, color: '#7c94ed' },
  mobile: { Symbol: SmartphoneNfc, color: '#6dd8c9' },
  qa: { Symbol: ShieldCheck, color: '#a4d88a' },
  'qa-automation': { Symbol: Bot, color: '#5ec2b6' },
  designer: { Symbol: PenTool, color: '#e9a0cf' },
  'ux-research': { Symbol: ScanSearch, color: '#cb9de8' },
  analyst: { Symbol: Workflow, color: '#92b9ee' },
  'business-analyst': { Symbol: Scale, color: '#d8c096' },
  product: { Symbol: Target, color: '#efb267' },
  project: { Symbol: Map, color: '#d2c28d' },
  delivery: { Symbol: Flag, color: '#e1a080' },
  devops: { Symbol: Container, color: '#7aaae8' },
  sre: { Symbol: Activity, color: '#ef8b74' },
  sysadmin: { Symbol: KeyRound, color: '#91bfa2' },
  security: { Symbol: Shield, color: '#bd99e8' },
  'data-analyst': { Symbol: ChartNoAxesCombined, color: '#76c8c4' },
  'data-engineer': { Symbol: Network, color: '#8aaee8' },
  dba: { Symbol: Database, color: '#dab175' },
  'solution-architect': { Symbol: Blocks, color: '#b0abe3' },
  architect: { Symbol: Castle, color: '#ddbb74' },
  support: { Symbol: Headset, color: '#9ad0a4' },
} as const;

/** Decorative class emblem; the adjacent profession name supplies its accessible label. */
export function ProfessionIcon({ profession, size = 44 }: { profession: string; size?: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const { Symbol, color } = professionEmblems[profession as keyof typeof professionEmblems] ?? professionEmblems.frontend;
  const gold = `profession-gold-${uid}`, core = `profession-core-${uid}`;
  return <span className="profession-icon" data-profession-icon={profession} style={{ width: size, height: size }} aria-hidden="true">
    <svg viewBox="0 0 64 64" width={size} height={size} fill="none" focusable="false">
      <defs>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fff1bf"/><stop offset=".28" stopColor="#c4a365"/>
          <stop offset=".5" stopColor="#71512e"/><stop offset=".74" stopColor="#e6cc8d"/><stop offset="1" stopColor="#8d6c3c"/>
        </linearGradient>
        <radialGradient id={core}>
          <stop stopColor={color}/><stop offset="1" stopColor="#111d28"/>
        </radialGradient>
      </defs>
      <path d="M14 2H50L62 14V50L50 62H14L2 50V14Z" fill="#141d25" stroke={`url(#${gold})`} strokeWidth="2"/>
      <path d="M15 7H49L57 15V49L49 57H15L7 49V15Z" fill={`url(#${core})`} fillOpacity=".5" stroke={`url(#${gold})`} strokeOpacity=".65"/>
      <path d="M17 11H47L53 17V47L47 53H17L11 47V17Z" fill="#101c28" fillOpacity=".4" stroke={color} strokeOpacity=".35"/>
      <path d="M4 17L17 4M47 4L60 17M60 47L47 60M17 60L4 47" stroke={`url(#${gold})`} strokeWidth="3"/>
      <path d="M25 6L32 3L39 6M58 25L61 32L58 39M39 58L32 61L25 58M6 39L3 32L6 25" stroke="#f6df9d" strokeWidth=".8"/>
      <circle cx="32" cy="32" r="19" stroke={color} strokeOpacity=".25"/>
      <Symbol className="profession-symbol" x={19} y={19} width={26} height={26} stroke="#fff0c6" strokeWidth={1.6}/>
      <path d="M28 55L32 51L36 55L32 59Z" fill={color} stroke="#f1d59c" strokeWidth=".7"/>
    </svg>
  </span>;
}
