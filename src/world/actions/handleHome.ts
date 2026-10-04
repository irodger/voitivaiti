import { deliveryFor, currentDelivery } from '../delivery';
import { availableWalkRoutes, canBeginWalk, currentWalk } from '../walk';
import { eveningActivities, eveningDone, canSpendEvening } from '../evening';
import { marketItems } from '../../content/marketplace';
import { homeState } from '../economy';
import { homeUpgrades } from '../../content/home';
import { history } from '../simulation';
import type { Action, TransitionResult } from './types';
import type { ActionContext } from './context';
export function handleHome(ctx: ActionContext, action: Action): TransitionResult | undefined {
    const { c, source, feedback, ch, effects, tick, emit } = ctx;
    if (action.type === 'order') {
        const item = marketItems.find(i => i.id === action.itemId);
        if (!item || !['office', 'home', 'reward'].includes(c.phase) || ch.stats.money < item.price || homeState(ch).owned.includes(item.id) || ch.orders?.some(o => o.itemId === item.id))
            return { campaign: source, feedback };
        ch.orders = [...(ch.orders ?? []), { itemId: item.id, orderedDay: c.company.currentDay, deliveryDay: c.life!.calendarDay + 1, received: false }];
        effects([{ target: 'money', value: -item.price }]);
        emit('market_ordered', { itemId: item.id, amount: item.price, day: c.company.currentDay });
    }
    else if (action.type === 'inspect-delivery') {
        const delivery = deliveryFor(ch, action.itemId, c.life!.calendarDay);
        if (c.phase !== 'home' || currentWalk(ch, c.company.currentDay) || !delivery)
            return { campaign: source, feedback };
        ch.home = { ...homeState(ch), deliveryItemId: delivery.item.id };
        emit('delivery_opened', { itemId: delivery.item.id, received: delivery.order.received });
    }
    else if (action.type === 'close-delivery') {
        if (c.phase !== 'home' || !ch.home?.deliveryItemId)
            return { campaign: source, feedback };
        delete ch.home.deliveryItemId;
    }
    else if (action.type === 'unpack') {
        const order = ch.orders?.find(o => o.itemId === action.itemId), item = marketItems.find(i => i.id === action.itemId);
        if (c.phase !== 'home' || currentWalk(ch, c.company.currentDay) || !order || !item || order.received || order.deliveryDay > c.life!.calendarDay)
            return { campaign: source, feedback };
        order.received = true;
        const home = homeState(ch);
        ch.home = { ...home, deliveryItemId: item.id, owned: [...new Set([...home.owned, item.id])] };
        history(c, 'delivery', item.titleKey);
        emit('market_received', { itemId: item.id, day: c.company.currentDay });
    }
    else if (action.type === 'buy-home') {
        const item = homeUpgrades.find(u => u.id === action.id);
        const home = homeState(ch);
        if (c.phase !== 'home' || !item || home.owned.includes(item.id) || ch.stats.money < item.price)
            return { campaign: source, feedback };
        ch.home = { ...home, owned: [...home.owned, item.id] };
        effects([{ target: 'money', value: -item.price }]);
        history(c, 'home-upgrade', item.titleKey);
        emit('home_upgrade_purchased', { upgradeId: item.id, characterId: ch.id });
    }
    else if (action.type === 'start-walk') {
        if (c.phase !== 'home' || currentDelivery(ch, c.life!.calendarDay) || !canBeginWalk(ch, c.company.currentDay, c.time))
            return { campaign: source, feedback };
        ch.home = { ...homeState(ch), walk: { day: c.company.currentDay, status: 'choosing' } };
        emit('walk_opened', { day: c.company.currentDay });
    }
    else if (action.type === 'walk-route') {
        const outing = currentWalk(ch, c.company.currentDay), route = availableWalkRoutes(ch, c.company.currentDay, c.time).find(r => r.id === action.id);
        if (c.phase !== 'home' || outing?.status !== 'choosing' || !route)
            return { campaign: source, feedback };
        const before = ch.stats.stress, observationKey = 'walk.' + route.id + (before >= 60 ? '.tired' : '.result');
        effects([{ target: 'stress', value: -route.stress }]);
        tick(route.minutes);
        ch.home = { ...homeState(ch), eveningDay: c.company.currentDay, eveningActions: [...eveningDone(ch, c.company.currentDay), 'walk'], walk: { day: c.company.currentDay, status: 'finished', routeId: route.id, observationKey, minutes: route.minutes, stressBefore: before, stressAfter: ch.stats.stress } };
        history(c, 'evening', observationKey, { values: { minutes: route.minutes, stress: before - ch.stats.stress } });
        emit('evening_choice', { choiceId: 'walk', routeId: route.id, minutes: route.minutes, day: c.company.currentDay });
    }
    else if (action.type === 'end-walk') {
        if (c.phase !== 'home' || !currentWalk(ch, c.company.currentDay))
            return { campaign: source, feedback };
        const home = homeState(ch);
        delete home.walk;
        ch.home = home;
    }
    else if (action.type === 'evening') {
        const home = homeState(ch);
        if (c.phase !== 'home' || currentWalk(ch, c.company.currentDay) || currentDelivery(ch, c.life!.calendarDay) || !['walk', 'cook', 'read', 'games'].includes(action.id) || !canSpendEvening(ch, c.company.currentDay, c.time, action.id))
            return { campaign: source, feedback };
        ch.home = { ...home, eveningDay: c.company.currentDay, eveningActions: [...eveningDone(ch, c.company.currentDay), action.id] };
        effects(action.id === 'games' ? [{ target: 'stress', value: -5 }] : action.id === 'walk' ? [{ target: 'stress', value: -7 }] : action.id === 'cook' ? [{ target: 'energy', value: home.owned.includes('kitchen') ? 30 : 15 }] : [{ target: 'craft', value: 1 + (home.owned.includes('library') ? 1 : 0) }, { target: 'energy', value: home.owned.includes('chair') ? 0 : -5 }]);
        c.time += eveningActivities[action.id];
        history(c, 'evening', 'evening.done.' + action.id);
        emit('evening_choice', { choiceId: action.id, day: c.company.currentDay });
    }
}
