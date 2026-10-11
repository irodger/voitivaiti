# Mail conversations — v0.59.4

Inbox groups saved messages by their existing thread identity, ordered by latest delivery. Each conversation keeps its own unread count for the active hero. The reader offers earlier/later navigation in saved delivery order, including messages sent on the same day.

Selecting a message uses the existing read action for that message alone. Grouping is a pure view and does not create contacts, consume causes, mark a conversation read, or change task progress. Existing related-work navigation remains available.

Validation: 435 tests / 75 files and production build passed. Isolated desktop and mobile checks confirmed read persistence, unchanged task progress, navigation to existing work, no horizontal overflow and no page errors. Targeted grouping coverage checks interleaved threads, same-day order, per-hero unread counts, outgoing messages, serialization and empty mailboxes.
