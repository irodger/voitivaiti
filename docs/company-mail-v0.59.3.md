# Working mail navigation — v0.59.3

Messages now explain whether related work can resume, another task is active, the hero is off duty, consequences are pending, or the problem is finished. Completed source work exposes its saved outcome in the message context. This summary does not reveal future consequences or generate a new task.

Inbox and laptop navigation share a pure resolver scoped to the message's project, problem and current hero. Opening a message never changes work state; resuming uses the existing task action and its guards. Queue navigation preserves ordinary causal routing rather than forcing the message's problem ahead of other unresolved work.

Validation: 434 tests across 74 files; production build; isolated desktop 1280×720 and mobile 390×844 browser checks for persistent read state, unchanged task progress, existing-task navigation, page errors and horizontal overflow. Resolver coverage includes busy/off-duty states, completed results, pending consequences, foreign heroes/projects and serialized reload.
