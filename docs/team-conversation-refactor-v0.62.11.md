# Team and conversation boundaries — v0.62.11

## Scope
Behavior-preserving extraction of Team and Conversation. No changes to dialogue rewards, work ownership, career rules, or visual styles.

## Boundaries
- `teamDirectory`: pure roster visibility, filtering, contextual suggestions, and real work expectations. Available topics are computed once per teammate.
- `useTeamDirectory`: local filters and selected conversation.
- `TeamBanner`, `TeamHighlights`, `TeamFilters`, `TeamMemberCard`: presentation.
- `conversationModel`: live and archived topics, selected answer, groups, work commitments, and shared work memory.
- `useConversation`: topic selection, reply dispatch, local before/after reward display, and thread scrolling.
- `ConversationSidebar`, `ConversationSpecialStage`, `ConversationTopicStage`: presentation inside the existing modal.
- `characterName`: shared translation-aware display name, with the previous shared-module export preserved.

## Compatibility
Existing DOM classes, public screen props, action IDs, and save format are preserved. Current topics override archived copies with the same ID. Reopened answers remain history rather than issuing another reply. Existing differences between Team expectation visibility and Conversation commitment visibility are preserved.

## Validation
- 482 tests across 90 files passed, including four new selector tests for ownership, archived dialogue, onboarding visibility, filtering, and selector immutability.
- Production TypeScript/Vite build passed; existing large content-chunk warning remains.
- Browser checks at 1280x720 and 360x640: office contact opens the actual work expectations conversation; no horizontal overflow or browser errors; task state and game time unchanged by viewing.
- Browser checks also confirmed shared work memory survives reload, stays read-only, and fits desktop/mobile without overflow.
