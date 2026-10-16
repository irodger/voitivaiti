import { Wallet } from 'lucide-react';
import { SectionTabs } from '../components/SectionTabs';
import '../content/evening';
import '../content/workLoop';
import '../content/workspaceUx';
import { currentDelivery } from '../world/delivery';
import { dailySalary, monthlySalary } from '../world/economy';
import { currentWalk } from '../world/walk';
import { ActionDock, ActionPanel } from './ActionDock';
import { ApartmentScene } from './ApartmentScene';
import { Delivery } from './Delivery';
import { HomeEvening } from './HomeEvening';
import { HomeShop } from './HomeShop';
import { Marketplace } from './Marketplace';
import { Button } from './shared';
import { HomeStatus } from './SpaceStatus';
import { useHome } from './useHome';
import { Walk } from './Walk';
export function Home({
  onWork,
}: {
  onWork?: () => void;
} = {}) {
  const { openMarket, w, ch, t, view, setView, panelRef, money, openView } = useHome();
  if (w.phase === 'home' && currentDelivery(ch, w.life!.calendarDay))
    return <Delivery onBack={setView} />;
  if (w.phase === 'home' && currentWalk(ch, w.company!.currentDay)) return <Walk />;
  return (
    <div className="world-work home-world">
      <section className="home-left">
        <ApartmentScene onShop={() => openView('shop')} onMarket={openMarket} />
        <div className="home-pay">
          <Wallet size={23} />
          <div>
            <small>{t('home.salary')}</small>
            <strong>{money(monthlySalary(ch))} ₽</strong>
          </div>
          <span>{t('home.daily', { price: money(dailySalary(ch)) })}</span>
        </div>
        <p className="home-market">
          {t('home.market')}{' '}
          <a href="https://habr.com/ru/specials/1060148/" target="_blank" rel="noreferrer">
            Хабр Карьера ↗
          </a>
        </p>
      </section>
      <ActionPanel desktopOnly className="world-task-panel home-panel">
        <SectionTabs
          value={view}
          onChange={setView}
          items={[
            { id: 'evening', label: t('home.evening') },
            { id: 'shop', label: t('home.shop') },
            { id: 'market', label: t('market.tab') },
          ]}
        />
        <div className="office-content" ref={panelRef}>
          {view === 'market' ? (
            <Marketplace />
          ) : view === 'shop' ? (
            <HomeShop />
          ) : w.phase !== 'home' ? (
            <>
              <HomeStatus />
              <h1>{t('workspace.atWork')}</h1>
              <p>{t('workspace.homePreview')}</p>
              {onWork && (
                <ActionDock>
                  <Button onClick={onWork}>{t('workspace.backToWork')}</Button>
                </ActionDock>
              )}
            </>
          ) : (
            <HomeEvening />
          )}
        </div>
      </ActionPanel>
    </div>
  );
}
