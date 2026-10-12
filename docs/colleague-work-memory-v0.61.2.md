# Shared work memory — v0.61.2

Conversations now include a separate read-only shared-work section. It contains completed results from work authored by that colleague or owned by their generated team, plus replies actually inspected by the current hero. Ready but unread replies are excluded. Future consequence text, unrelated people, other heroes and other-company projects are excluded.

Opening a colleague prioritizes existing real commitments; otherwise shared memory opens when available. Explicitly selected conversation topics retain their behavior. History has no response choices, reward actions or automatic NPC generation. Limited results and evidence-only contributions are distinguished, and past replies are labelled as records from their original check.

Validation: full suite passed (461 tests / 81 files), targeted conversation/company tests passed after the final default-view adjustment, production build passed. Desktop/mobile browser checks confirmed the Platform history opens directly and viewing does not change tasks, skills, relationships or hero state. No page errors or horizontal overflow were observed. Targeted chain cases cover unread reply exclusion, actual inspection, bounded/verified results, reload and isolation from unrelated colleagues/heroes.
