# Local progress, drafts, and reliability

## What is implemented

- Profile and progress are loaded before learners can edit. Defaults are not saved during startup.
- Existing AsyncStorage keys (`userProfile`, `userProgress`) are retained. Older valid records gain missing completion/draft fields without resetting their existing totals.
- Changes are queued in order. Save failures keep the latest state in memory, show a warning, and offer retry. Retry writes the current state without re-awarding rewards.
- Failed or invalid reads block editing and offer retry. Existing stored bytes are left untouched; there is no automatic destructive reset.
- Reading completion is stored by story ID. First completion adds 10 XP and one score/session entry. Replays display the attempt score but do not change the first-completion record, quiz average, or XP.
- Everyday English completion is recorded inside practice before navigation. XP equals the correct answers on first completion. Replays do not add rewards. Visiting or refreshing the completion URL cannot award XP.
- Question submission and continue actions have synchronous guards; each new question resets its selection. Sentence-building supports repeated words as separate tokens.
- Writing has two starter prompts with autosaved drafts, manual save/retry, and a self-review checklist. A saved empty edit stays empty. Writing is not automatically graded and awards no XP.
- Loading, saved/saving, empty content, invalid quiz, and storage error states have explanatory text and actions.
- Reading/quiz/module feedback and completion screens scroll instead of overlaying important controls. Home cards stack at narrow widths and larger font scales; controls have text labels, and shared blue is darker for contrast.

## Storage limits and next steps

No database is required for these changes. AsyncStorage stores data locally on a phone or in the current browser origin. It is not a backup service or encrypted vault.

| Limitation | Next step |
| --- | --- |
| No account, cloud backup, cross-device sync, or reinstall recovery | Choose backend storage and authentication, define learner privacy/access rules, and implement sync with conflict handling |
| One active app session/browser tab is assumed; simultaneous tabs can overwrite each other's records | Add cross-tab coordination or use server transactions when multi-session use is needed |
| Abrupt process termination can interrupt a pending write | Wait for the saved indicator; device-test lifecycle behavior, and consider transactional local storage if stronger durability is required |
| A corrupted record blocks access to protect the original data | Investigate/recover the record; a future explicit export/recovery/reset tool should require learner consent before deleting data |
| Reading marks quiz completion, not a saved scroll position or partial quiz | Add a versioned reading/quiz resume model if partial-activity resume is needed |
| Only two writing prompts and self-review; no AI/teacher assessment | Have content reviewers expand prompts/rubrics; add backend assessment only as separately scoped work |
| Previous completions were not recorded with IDs | Old XP/averages are retained, but cannot be retroactively attributed or deduplicated. The first completion after this update starts the new per-activity record |
| Chat/conversation were outside scope and untouched | Separately audit speaking session timing/reward calls and backend failures if those features need guarantees too |
| Layout changes are not a full accessibility certification | Test actual iOS/Android devices, VoiceOver/TalkBack, large text, and narrow displays before release |

Do not store sensitive learner information in writing prompts or drafts. Local-only rewards are not tamper-proof or authoritative for leaderboards.

## Validation

```sh
npm run typecheck
npm run test:reliability
```

The regression suite covers delayed hydration, failed/corrupt reads, legacy data migration, ordered writes, draft restore/empty edits, failed-save retry, and duplicate/invalid completion rewards. It runs independently of the existing React Test Renderer version mismatch.

Browser validation passed for profile/draft reloads, failed draft-save recovery, rapid quiz taps, reward-free replays, completion-page refreshes, corrupt-data protection, and 320/390 px layouts. A browser stress check doubles text sizes; it does not replace native Dynamic Type or screen-reader testing.

Before release, manually verify:

1. Edit a profile, restart, and confirm it remains.
2. Complete a story, restart, replay, and confirm completion/XP are unchanged.
3. Finish a module while tapping answer/continue repeatedly. Return to its completion screen; XP must remain unchanged.
4. Type a writing draft, switch prompts, restart, and resume it. Clear text and confirm it does not reappear.
5. Simulate read/write failures in a development build. Confirm retry preserves original records and unsaved work.
6. Test 320–390 px widths and 200% font size, including feedback/completion, the keyboard, and writing review.
7. Run VoiceOver/TalkBack; confirm button names, selected answers, and errors make sense.
