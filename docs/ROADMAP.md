# First-cohort roadmap

This is a proposed delivery sequence, not a promise that every feature will fit in one cohort. Prioritize reading and writing; make pathway and rewards depend on reliable exercise completion.

## Workstream 1: Reading quality

Deliver a small, reviewed library before expanding volume.

- Audit the four existing stories against the quality guide.
- Add learning objectives, useful vocabulary, answer explanations, and reviewed difficulty labels.
- Improve question variety: retrieval, inference, vocabulary in context, and sequencing where suitable. Scope changes to the question model before adding new formats.
- Persist completion with stable content IDs; preserve it across app restarts.
- Improve reader readability and navigation, including larger text.

Acceptance: a learner reads a reviewed story, receives understandable feedback, completes the quiz, and sees saved completion after reopening the app.

## Workstream 2: Writing practice

Begin with guided writing, without requiring AI assessment.

- Define typed prompts with objectives, support level, sentence starters, and a simple rubric.
- Start with an everyday message, a short description, and a response to a reading.
- Build draft editing, save/resume, and revision.
- Provide a self-review checklist and clearly labeled sample responses after the attempt.
- Explore AI feedback later with a lead-approved backend contract and evaluation set. Feedback should preserve the learner's ideas and encourage revision.

Acceptance: a learner chooses a prompt, writes and resumes a draft, reviews it against a rubric, revises, and completes the activity. Open-ended writing is not scored through exact text matching.

## Workstream 3: Journey and motivation

- Model unit → lesson → activity, combining reading and writing around shared themes.
- Display completed/current/upcoming lessons and an obvious next action.
- Track each activity independently from time-based practice levels.
- Award XP once per defined completion event; define retry/replay rules.
- Add meaningful milestones, optional goals, and later streaks with documented day/timezone rules.
- Prefer encouragement and flexible practice over punitive locks or public rankings.

Acceptance: completed lessons survive restart, next steps are correct, replay cannot accidentally duplicate XP, and learners can revisit prior lessons.

## Suggested 12-week sequence

| Weeks | Focus | Reviewable outcome |
| --- | --- | --- |
| 1–2 | Onboarding, audits, schemas, small fixes | Agreed issues and one small merged contribution per intern |
| 3–6 | Reading improvements and writing foundations | Reviewed reading flow and usable writing draft flow |
| 7–9 | Persistence, feedback, pathway | Connected learning unit with reliable resume/completion |
| 10–12 | Rewards, accessibility, QA, documentation | Pilot-ready demonstration and handoff |

Start with two teams (reading and writing), with a lead coordinating shared progress/pathway work. AI conversation expansion and school/VLE integration are later priorities.

## Initial issues to create

1. Audit existing stories and question quality (content, starter).
2. Add answer explanations to the reading model and feedback UI (reading).
3. Persist reading completion using stable IDs (progress).
4. Define writing prompt schema and review rubric (writing).
5. Build a writing editor with saved drafts and resume (writing).
6. Create one mixed reading/writing unit and next-lesson flow (pathway).
7. Make XP awards idempotent and define replay behavior (progress).
8. Add regression tests for quiz scoring, drafts, and completion (quality).
9. Fix profile/progress storage hydration before enabling more saved features (quality).
10. Establish lint configuration, align test dependencies, and expand CI (quality).

Each issue needs a lead, scope, acceptance criteria, validation plan, and dependencies. Assign `good first issue` only after sizing it for a newcomer.
