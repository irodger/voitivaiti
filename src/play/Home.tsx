import { formatNumber } from '../utils/format';
import { SectionTabs } from '../components/SectionTabs';
import { gameConfig } from '../config/game';
import { HomeShop } from './HomeShop';
import { HomeEvening } from './HomeEvening';
import { useScrollReset } from '../hooks/useScrollReset';
import { HomeStatus } from './SpaceStatus';
import { ActionPanel, ActionDock } from './ActionDock';
import '../content/workspaceUx';
import { Delivery } from './Delivery';
import { currentDelivery } from '../world/delivery';
import { Walk } from './Walk';
import { currentWalk } from '../world/walk';
import '../content/evening';
import '../content/workLoop';
import { Marketplace } from './Marketplace';
import { ApartmentScene } from './ApartmentScene';
import { useRef, useState } from 'react';
import { Wallet } from 'lucide-react';
import { useWorld } from '../world/store';
import { activeCharacter } from '../world/simulation';
import { monthlySalary, dailySalary } from '../world/economy';
import { useI18n } from '../content/localization';
import { Button } from './shared';
export function Home({ onWork }: {
    onWork?: () => void;
} = {}) { const w = useWorld(), ch = activeCharacter(w), { t, locale } = useI18n(), [view, setView] = useState<'evening' | 'shop' | 'market'>('evening'); const panelRef = useRef<HTMLDivElement>(null); useScrollReset(panelRef, view); const money = (n: number) => formatNumber(n, locale); const openView = (next: 'shop' | 'market') => { setView(next); if (window.matchMedia(gameConfig.ui.compactQuery).matches)
    requestAnimationFrame(() => document.querySelector('.home-panel')?.scrollIntoView({ block: 'start', behavior: 'smooth' })); }; if (w.phase === 'home' && currentDelivery(ch, w.life!.calendarDay))
    return <Delivery onBack={setView}/>; if (w.phase === 'home' && currentWalk(ch, w.company!.currentDay))
    return <Walk />; return <div className="world-work home-world"><section className="home-left"><ApartmentScene onShop={() => openView('shop')} onMarket={() => { const parcel = ch.orders?.find(o => !o.received && o.deliveryDay <= w.life!.calendarDay); if (w.phase === 'home' && parcel)
    w.dispatch({ type: 'inspect-delivery', itemId: parcel.itemId });
else
    openView('market'); }}/><div className="home-pay"><Wallet size={23}/><div><small>{t('home.salary')}</small><strong>{money(monthlySalary(ch))} ₽</strong></div><span>{t('home.daily', { price: money(dailySalary(ch)) })}</span></div><p className="home-market">{t('home.market')} <a href="https://habr.com/ru/specials/1060148/" target="_blank" rel="noreferrer">Хабр Карьера ↗</a></p></section><ActionPanel desktopOnly className="world-task-panel home-panel"><SectionTabs value={view} onChange={setView} items={[{ id: 'evening', label: t('home.evening') }, { id: 'shop', label: t('home.shop') }, { id: 'market', label: t('market.tab') }]}/><div className="office-content" ref={panelRef}>{view === 'market' ? <Marketplace /> : view === 'shop' ? <HomeShop /> : w.phase !== 'home' ? <><HomeStatus /><h1>{t('workspace.atWork')}</h1><p>{t('workspace.homePreview')}</p>{onWork && <ActionDock><Button onClick={onWork}>{t('workspace.backToWork')}</Button></ActionDock>}</> : <HomeEvening />}</div></ActionPanel></div>; }
