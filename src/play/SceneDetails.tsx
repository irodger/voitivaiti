import { MoonStar, Coffee, MessagesSquare, ShieldAlert, TrendingUp, ClipboardCheck, Building2, ArrowUpRight } from 'lucide-react';
import { useI18n,text } from '../content/localization';
text('ui.dayWrapTitle','На сегодня — всё.','A good place to pause.');
text('ui.dayWrapNote','Маленькие задачи. Настоящий прогресс.','Small tasks. Real progress.');
text('ui.tomorrowNote','Завтра — новая глава.','A new chapter tomorrow.');
text('ui.officeLive','Жизнь в офисе','Office life');
text('ui.yourDesk','Твоё рабочее место','Your workspace');
text('ui.todayProgress','План дня','Today’s plan');
text('ui.eventsDone','{done} из {total}','{done} of {total}');
export function SceneMark({kind}:{kind:string}){const Icon=kind==='dialogue'?Coffee:kind==='sync'?MessagesSquare:kind==='incident'?ShieldAlert:kind==='career'?TrendingUp:kind==='company'?Building2:ClipboardCheck;return <div className={`scene-mark mark-${kind}`} aria-hidden="true"><Icon size={26} strokeWidth={1.4}/><span>✦</span></div>}
export function EveningScene(){return <div className="evening-scene" aria-hidden="true"><div className="evening-orbit orbit-one"/><div className="evening-orbit orbit-two"/><span className="evening-star star-one">✦</span><span className="evening-star star-two">✧</span><div className="evening-disc"><svg viewBox="0 0 180 160"><defs><linearGradient id="door-light" x2="1" y2="1"><stop stopColor="#f8d5a0"/><stop offset="1" stopColor="#dab77c"/></linearGradient></defs><path d="M30 139L98 108L158 134L93 158Z" fill="#c5d4ab"/><path d="M52 135V34Q52 24 62 24H119Q128 24 128 34V134" fill="#3c584b"/><path d="M63 134V36H117V132" fill="url(#door-light)"/><path d="M63 36L100 50V144L63 133Z" fill="#77917b"/><path d="M67 40L95 51V134L67 125Z" fill="#87a088"/><circle cx="90" cy="95" r="3" fill="#e8cf9c"/><path d="M99 143L118 132L155 145L130 157Z" fill="#ead9a5" opacity=".8"/><path d="M33 129v-28m0 16Q12 101 24 90Q40 97 33 117m0-8Q45 85 52 97Q53 110 33 117" fill="#66866b" stroke="#4b7056" strokeWidth="2"/><path d="M24 122h20l-3 18H28Z" fill="#bc9272"/></svg><MoonStar className="evening-moon" size={29} strokeWidth={1.4}/></div></div>}
export function PanelFooter(){const {t}=useI18n();return <div className="panel-signoff"><span>{t('ui.tomorrowNote')}</span><ArrowUpRight size={14}/></div>}
