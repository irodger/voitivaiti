import { useI18n } from '../content/localization';
import { recentIssues } from '../world/life';
import { promotionChecks } from '../world/mastery';
import { activeCharacter, activeTask } from '../world/simulation';
import { useWorld } from '../world/store';
import { warningReviewDetails } from '../world/warningReview';
export function usePromotionRequirements(props: {
    nodeId: string;
}) {
    const { nodeId } = props;
    const w = useWorld();
    const ch = activeCharacter(w);
    const { t, locale } = useI18n();
    const active = !!activeTask(w) && !activeTask(w)!.rewarded;
    const checks = promotionChecks(ch, nodeId);
    const experience = checks.filter(c => c.key !== 'promotion.warning');
    const missing = experience.filter(c => !c.met);
    const done = experience.filter(c => c.met);
    const warning = warningReviewDetails(w);
    const level = ch.reviewStage ?? 0;
    const goodDays = Math.max(0, Math.min(2, w.life?.goodDays ?? 0));
    const issues = w.life ? Object.entries(recentIssues(w)).filter(([, count]) => count > 0) : [];
    return { w, t, locale, active, missing, done, warning, level, goodDays, issues };
}
