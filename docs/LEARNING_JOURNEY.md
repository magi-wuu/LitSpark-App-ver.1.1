# Learning journey: first implementation

## Navigation

`app/(tabs)/` contains Home, Learn, Practice, and Profile tabs. Their screen implementations live in `screens/`, with shared presentation in `components/AppDesign.tsx`. The old `/` and `/profile` URLs redirect to `/home` and `/account`. Standalone reading, writing, everyday-English, chat, and conversation routes remain accessible from Practice. Unit activities open as focused screens above the tab navigator.

## Pilot unit

`content/learningUnit.ts` defines **Everyday confidence: Asking for help**:

1. Read a short dialogue and practice three questions. Correct answers save immediately, so partial reading can resume. Incorrect answers show an explanation and allow another try.
2. Write a message to a teacher. The unit uses its own draft key (`unit-asking-for-help`) so existing standalone drafts are not overwritten.
3. Self-review the message with three checks. Editing clears the checks. Completing review saves a snapshot of the first reviewed message and marks the unit complete.

This is pilot content, not a validated proficiency assessment. Have an ESL educator review it before public release. Writing and self-review record practice, not correctness or a teacher/AI grade.

## Saved progress and rewards

`lib/journeyState.ts` contains pure transition and validation functions. `ProgressContext` saves these through the existing serialized local store. Existing valid user data migrates with an empty `units` map. Older reading/module completions and XP are preserved.

Each unit activity earns 10 XP on first completion only (30 total). Prerequisites are enforced in both the screen and state transitions; visiting a URL cannot grant rewards. Replaying a completed activity does not change its first-completion rewards or quiz average. An unfinished save stays recoverable in memory and can be retried without adding XP again.

Home displays actual total XP, completed activities, and unit completion. Unit 2 is clearly labeled as upcoming, with a link to existing standalone practice. Streaks and XP are real saved values. No sample daily-goal, league, or currency values are shown.

## Deliberately deferred

Streak/date rules and the illustrated cloud UI are now implemented; see `STREAKS_AND_ART.md`. Daily goals, extra milestone bonuses, deeper celebration animations, and more units remain separate work. Accounts, backend sync, cross-device recovery, and automatic writing assessment are not included. Chat/conversation implementations are unchanged. Native Dynamic Type, VoiceOver/TalkBack, and physical-device keyboard testing still need release QA.

## Verification

Run `npm run typecheck` and `npm run test:reliability`. Journey regression tests cover ordering, partial-reading restore, separate drafts, cleared self-checks after edits, full-unit migration/restore, and reward idempotence including failed-save retries.

Manual acceptance flow: Home → start unit → answer one reading question → restart → resume remaining questions → write/save/restart → review/revise/check → finish → confirm 30 XP and completion → revisit each activity and confirm XP stays unchanged.

Browser acceptance checks passed for all four tabs, prerequisite protection, partial reading and draft restore, revision clearing checks, failed-save recovery, complete-unit replay, and 320/390 px layouts. Web tab/checkbox selection is explicitly exposed through ARIA as well as native accessibility state.
