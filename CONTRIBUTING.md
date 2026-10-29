# Contributing to LitSpark

Welcome! Contributions should help learners practice useful English and make the app easier to maintain. Questions and early draft pull requests are encouraged.

## Before starting

- Follow README setup and ask your lead which issue to take.
- Agree on the learner goal, acceptance criteria, and scope before implementing.
- Use synthetic examples and test data. Never commit learner messages, recordings, names, credentials, or private program documents.
- Keep backend/provider secrets out of the app; bundled client values are not secret.

## Branches and pull requests

Create a branch such as `feature/writing-drafts`, `fix/reading-progress`, or `docs/setup`. Keep one coherent change per PR. Include the issue, what changed, how it was validated, and any limitations. Show screenshots for visual changes.

Ask a project lead for review. Resolve feedback and failing checks before merge. Maintainers approve major architecture changes and releases. Do not commit directly to the default branch once branch protection is configured.

## Coding and content standards

- Use TypeScript and explicit types for exercise content and progress.
- Reuse existing components and shared colors in `constants/theme.ts`; preserve the navy, blue, yellow identity and chick mascot.
- Give pressable controls accessible names, readable contrast, and usable touch targets. Do not convey answer correctness with color alone.
- Keep content separate from rendering. Use stable IDs when storing completion or drafts.
- Follow [exercise quality criteria](docs/EXERCISE_QUALITY.md); AI-generated material needs human review before shipping.
- Avoid unrelated dependency upgrades, native regeneration, and large formatting changes.

## Validation

Run `npm run typecheck`. Manually exercise the affected flow, including empty/error states and a narrow screen. For storage changes, close/reopen the app and verify saved state. For scoring/reward changes, test retries and repeated completion to detect duplicate awards. Add focused automated tests for meaningful behavior changes.

Jest is configured, but there is no established application test suite yet and the renderer version needs alignment. `npm test` starts watch mode; do not treat an empty suite as evidence of correctness. The initial CI gate runs typechecking. Lint configuration and stronger test gates are backlog work.

## Definition of done

A change meets its acceptance criteria, passes available checks, has relevant manual/test evidence, works with accessibility supports where applicable, updates affected documentation, and is reviewed by a lead. Content changes also receive an educational quality review.

## Getting help

Put a blocker on your issue with expected behavior, actual behavior, reproduction steps, and a sanitized error. Contact your assigned lead through the cohort's agreed communication channel. Leadership will confirm contacts and meeting details during onboarding.
