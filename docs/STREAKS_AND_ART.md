# Streaks and illustrated UI

## Rules

- Complete a reading quiz, guided unit activity, everyday-English lesson, explicitly reviewed standalone writing practice, or speaking session to record a practice day.
- Opening the app and typing a draft alone do not count.
- Replays count as practice on a new day, but do not duplicate first-completion XP or scores.
- One or several activities on one local calendar day count as one day. The current streak remains active if the latest day is today or yesterday; after a full missed day, current resets to zero. Longest streak remains in the saved history.
- Days use the device's local date. Calendar comparisons use day ordinals, so 23-hour/25-hour daylight-saving days do not break counting.
- `practiceDays` is the durable day ledger; the visible current count is derived, refreshing on app resume and at most a minute after midnight. It is not the old static `streak` field alone.
- Older records migrate only activity dates already backed by completion/last-session timestamps. Missing historical practice cannot be reconstructed. No invented dates are added to pad a streak.
- This remains local-only; reinstall, cross-device synchronization, simultaneous browser tabs, and device-clock tampering have the same limitations as other local progress.

Tap the flame badge on Home or Learn to see the current streak, longest streak, and recent practice days. Standalone writing gains an explicit "I've reviewed my message" action; this records practice but does not claim a writing grade or grant extra XP.

## Artwork

`components/GameArt.tsx` contains original, layered SVG illustrations for books, pencils, review messages, treasure chests, flames, sparks, practice tools, and navigation. Highlights, shadows, and blue/yellow gradients are vector-native and remain crisp on different devices. Decorative icons and clouds do not replace accessible text labels.

`CloudBackdrop` draws soft, layered blue cloud scenery behind Home, Learn, and Practice, and deeper navy-to-blue clouds inside the unit banners. Touches pass through the decoration. Completed checkpoints retain their illustration with a check badge rather than losing their identity to a generic check icon.

`assets/images/chick-cloud.png` is a new transparent illustration generated with the built-in image tool. Original mascot assets are unchanged. Prompt: "One LitSpark yellow chick, matching the approved mascot and mockup, perched on a small light blue cloud, one wing proudly holding a tiny golden spark. Preserve two top tufts, oval navy eyes, orange beak/feet, peach cheeks, navy outlines, warm yellow shading. Cloud in pale blue with a blue underside, a few small blue/yellow sparkles, entire character centered with transparent padding, readable at 120px, no text or background disc."

## Verification

`npm run test:reliability` includes same-day deduplication, consecutive/missed days, longest streak, local-vs-UTC dates, daylight-saving boundaries, midnight rollover, replay-without-XP, and migration/invalid-data tests. Continue to test native large text, screen readers, and device-clock changes before release.

Browser verification passed for the saved counter, streak detail screen, reviewed-writing day recording, same-day deduplication, reload persistence, tappable illustrated checkpoints, SVG gradients/cloud mascot loading, and 320/390 px layouts. Shared secondary text is darkened to preserve contrast against the new pale-blue backgrounds. Native accessibility testing remains a release task.
