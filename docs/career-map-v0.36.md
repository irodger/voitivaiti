# v0.36.0 — career map

Replaced the old horizontal career cards with an inspectable connected map. It derives edges from existing career node next links, including the Frontend fork. Current, previously reached, directly next and future nodes have distinct styling. A sibling branch is not falsely marked completed.

Stage icons, layered backgrounds, dotted map paper, connectors and current-character portrait use existing code/native assets. Selecting a future stage shows actual promotion checks; it does not promote the character. Existing promotion and hiring controls remain below the map.

Mobile uses a vertical map, desktop a horizontal map. The map comes before career pacing copy to make the development path the screen's focal point.

Validation: layout tests cover every profession's edges and the Frontend sibling branch; existing responsibility UI tests pass. Production build passed. Inspected the mobile career screen in the in-app browser.
