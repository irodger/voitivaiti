import { formatNumber } from '../utils/format';
import { useWorld } from '../world/store';
import { activeCharacter } from '../world/simulation';
import { useI18n } from '../content/localization';
import { homeState } from '../world/economy';
import { Check, Armchair, Sprout, Lamp, BedDouble, BookOpen, CookingPot } from 'lucide-react';
import { homeUpgrades } from '../content/home';
const icons = [Sprout, Lamp, CookingPot, Armchair, BedDouble, BookOpen];
export function HomeShop() { const w = useWorld(), ch = activeCharacter(w), home = homeState(ch), { t, locale } = useI18n(), money = (n: number) => formatNumber(n, locale); return <><h1>{t('home.shop')}</h1><div className="home-shop">{homeUpgrades.map((u, i) => { const Icon = icons[i], owned = home.owned.includes(u.id), short = ch.stats.money < u.price; return <article className={owned ? 'installed' : ''} key={u.id}><Icon size={23}/><div><h3>{t(u.titleKey)}</h3><p>{t(u.descriptionKey)}</p></div><button disabled={owned || short || w.phase !== 'home'} onClick={() => w.dispatch({ type: 'buy-home', id: u.id })}>{owned ? <><Check size={14}/>{t('home.owned')}</> : t(short ? 'home.short' : 'home.buy', { price: money(short ? u.price - ch.stats.money : u.price) })}</button></article>; })}</div>{w.phase !== 'home' && <p>{t('ui.homeLocked')}</p>}</>; }
