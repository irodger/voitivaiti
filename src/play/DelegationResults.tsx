import '../content/responsibility';
import { Button, characterName } from './shared';
import { useDelegationResults } from './useDelegationResults';
export function DelegationResults() {
  const model = useDelegationResults();
  if (!model) return null;
  const { w, t, results } = model;

  return (
    <div className="remainder-queue">
      {results.map((d) => {
        const npc = w.characters.find((n) => n.id === d.npcId);
        return (
          <article className="remainder-card" key={d.id}>
            <h3>{t('responsibility.title')}</h3>
            <p>
              {npc && characterName(npc, t)} · {t('life.work.' + d.work)}
            </p>
            <p>{t('responsibility.result.' + d.result)}</p>
            <Button
              secondary
              onClick={() =>
                w.dispatch({ type: 'delegation-result', id: d.id, response: 'accept' })
              }
            >
              {t('responsibility.accept')}
            </Button>
            <Button
              secondary
              onClick={() =>
                w.dispatch({ type: 'delegation-result', id: d.id, response: 'clarify' })
              }
            >
              {t('responsibility.clarify')}
            </Button>
          </article>
        );
      })}
    </div>
  );
}
