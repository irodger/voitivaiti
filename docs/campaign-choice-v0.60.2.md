# Campaign choice clarity — v0.60.2

The initial Marketing campaign scope now describes two valid boundaries: a short local journey fix covering normal/double traffic, or broader work including expected triple traffic. Neither option is labelled correct or recommended. The saved action timings, branching, effects, rewards and causal outcomes remain unchanged.

Verification names the actual campaign journey conditions for the selected branch. Observations and handoff results retain the same boundary: bounded work leaves triple traffic open; verified broader work makes Product's next-version journey review possible. Evidence-only roles retain implementation ownership with the infrastructure owner.

The text overlay is restricted to this campaign's initial risk encounter. It updates scene text for already-started saves without replacing progress or changing the action graph. Other problem scenes and subsequent encounter mechanics remain untouched.

Validation: both frontend branches have targeted tests for labels in Russian/English, preserved graph/timings/effects/outcomes through reload, actual verification observations, result coverage and subsequent recurrence/Product review. A QA test preserves evidence-only semantics and checks unrelated scene text is unchanged. Full suite: 444 tests / 78 files. Production build and four browser routes (desktop/mobile × bounded/verified), with reload during owner waiting, passed without page errors or horizontal overflow.
