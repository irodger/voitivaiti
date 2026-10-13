# Mail browsing — v0.62.6

The inbox adds local All/Unread/Sent filters and subject/sender/team search. Thread navigation still uses the full saved thread, even when only some letters match the list filter. Search and filters never dispatch read actions. Opening a letter retains existing read behavior.

Message cards show a short first-paragraph preview. The mobile reader hides list tools while a letter is open; returning to the inbox keeps the local query/filter. No matches has one clear reset control. Styling uses the existing mail application palette with compact controls and a separate office-humor footer. Mobile search uses a 16px font to avoid small-input zoom on supported mobile browsers.

Validation: 467 tests / 83 files passed; production build passed with the existing chunk warning. Desktop 1280×720 and English/Russian phone 360×640 browser checks covered sent filtering, no-match search, reset and opening an unread letter. Filtering left mail unchanged; opening changed exactly one read state; task state stayed unchanged. No page errors or horizontal overflow. No new delivery rules, quests or company events were added.
