# Work mail for the Marketing causal chain, v0.59.2

## World channel

`Company.mail` stores messages with stable source-event IDs, the campaign thread, real team/person IDs, related project/problem/task, game day, direction and per-character `readBy` state. Messages are projections of the existing Marketing chain's facts; they carry no quest stages or success criteria.

The first campaign request arrives from the actual Marketing team. Its contact is materialized when the player reads that letter (or encounters the team through work). An owning-team request and clarification are sent only after the corresponding task actions. The owner reply uses the real generated contact that supplied the capacity result. Handoffs and follow-ups preserve the exact existing outcome/follow-up text and source task. Product's follow-up describes either the remaining bounded traffic or the next review after a proper fix.

No deadline-change mail is invented: this chain currently changes traffic and retains unresolved boundaries, not a simulated deadline. No other organizational events, layoffs or reorganizations are added.

## Inbox

Mail is a laptop channel separate from mechanic `AppId` steps. The launcher shows unread count; the taskbar also opens Mail. The work desk offers a shortcut when incoming mail is unread. Inbox shows incoming and sent correspondence, source departments/people, read states, and a reader with a linked problem. Mobile uses list/reader navigation.

Opening related work resumes the already active/paused task when possible. Otherwise it returns to the existing queue; it never assigns a separate email quest or completes an action. Reading marks the message and encounters its sender but changes no task evidence, XP, outcome, time or causal consumption. Reading the capacity email does not replace inspection inside the work artifact.

## Persistence and checks

Reload projects only missing letters from real saved history and retains read state. A source-event ID delivers once; unrelated problems produce no mail. Old letters keep their context after later decisions. Inbox rendering itself never mutates the world.

Targeted tests cover actual departments, one-time delivery, lazy contacts, read/unread reload, requests/clarification/exact-owner replies, no task evidence or rewards from reading, bounded recurrence and proper-fix Product review in one thread, old-history projection and render behavior. Browser checks at 1280×720 and 390×844 verify reading and reload, four persistent letters, unchanged task progress, no horizontal overflow or page errors, and opening the same work from a letter.

Validation: all 433 tests in 73 files pass (including six targeted mail/render cases); production build passes. Browser artifacts are under ignored `e2e-artifacts/mail/`.
