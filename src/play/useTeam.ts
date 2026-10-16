import { useState } from 'react';
import { useI18n } from '../content/localization';
import { useWorld } from '../world/store';
import { teamDirectory } from './teamDirectory';
export function useTeam() {
    const world = useWorld();
    const { t } = useI18n();
    const [query, setQuery] = useState('');
    const [onlyNew, setOnlyNew] = useState(false);
    const [profession, setProfession] = useState('all');
    const [selected, setSelected] = useState<{
        id: string;
        topic?: string;
    } | null>(null);
    return { t, ...teamDirectory(world, { query, onlyNew, profession }, t), query, setQuery, onlyNew, profession, setProfession, selected,
        toggleNew: () => setOnlyNew(value => !value), reset: () => { setQuery(''); setProfession('all'); setOnlyNew(false); },
        open: (id: string, topic?: string) => setSelected({ id, topic }), close: () => setSelected(null) };
}
export type TeamDirectoryController = ReturnType<typeof useTeam>;
