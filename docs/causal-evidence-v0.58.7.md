# Causal evidence v0.58.7

A routed continuation now supplies its encounter snapshot to existing history artifacts. Previous result and observations come from the source task, even if later work has added unrelated history. The new-condition row uses the actual causal fact instead of inferring a contract/environment change from the problem state.

Review artifacts retain two required evidence rows and add optional source-work context. No extra mandatory exploration or new scene family. Scene artifacts remain task snapshots through save/reload.

Regression tests cover out-of-order history, source observations, concrete cause, review optional rows, and reload. Tests only increased for these new behavioral protections; the earlier cleanup removed three source tests and added four existing build tests to the default run (412 - 3 + 4 = 413).
