# Office colleague access — v0.62.8

A compact collapsible office contact panel makes existing teammates reachable without clicking moving sprites. Live work expectations use the existing teamExpectations selector and show the linked problem where available. New conversation topics are labelled separately. Clicking a work contact opens the existing commitments view; clicking a new-topic contact opens an existing unseen topic. Unintroduced colleagues remain hidden during onboarding.

On desktop the expanded panel overlays the office instead of shrinking the scene. On phones it expands into a two-column list. Office simulation pauses while the panel’s conversation is open. The existing conversation layout now shrinks correctly for work-commitment content on phones, fixing text and action clipping.

Validation: 470 tests / 85 files passed; production build passed with the existing chunk warning. Targeted tests exclude resolved/delegated expectations and protect onboarding visibility. Desktop 1280×720 and phone 360×640 browser checks expanded contacts and opened a real campaign commitment; task state and game time remained unchanged. No page errors or horizontal overflow, including the conversation’s inner thread.
