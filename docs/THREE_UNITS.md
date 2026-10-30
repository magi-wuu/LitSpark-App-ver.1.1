# LitSpark: first three units

These original guided units target familiar school and community communication. The A1–A2/A2 labels describe intended practice difficulty, not validated CEFR placement or certification. Have an ESL educator review language level, answer keys, and cultural accessibility before public release; then pilot with learners.

| Unit | Learner outcome | Reading focus | Language warm-up | Writing and transfer |
| --- | --- | --- | --- | --- |
| 1. Asking for help | Ask a specific question politely and check an answer | Identify a problem, a polite request, and the instruction | Specific requests; base verb after could; checking understanding | Message a teacher; optionally add a confirmation question |
| 2. Making plans | Suggest, negotiate, and confirm an activity | Track changed details and the final agreed plan | How about + -ing; alternatives; day/time/place | Invite a classmate; optionally respond to a scheduling conflict |
| 3. Sharing an opinion | State a preference, explain a reason, and respond respectfully | Distinguish preference from resources and follow a combined idea | Because; respectful disagreement; cumulative review | Suggest a club activity; optionally add a clarification and meeting plan |

## Lesson structure

Each unit includes three outcomes, three word explanations, an original five-paragraph dialogue/story, three reading questions, three guided language questions with explanations, a writing task, a sentence frame, a toggleable example, a revision tip, a stretch task, and three self-review checks. Unit 2 retrieves clarification from Unit 1; Unit 3 retrieves both clarification and planning.

Reading → writing (including the recommended warm-up) → review. Reading answers must be correct before continuing; retries explain the target and do not penalise learners. Warm-up answers save independently, but the warm-up is optional and has no separate XP. Learners can write without copying a model or passing an automatic writing classifier. Examples demonstrate one possible response; no single opinion is marked correct.

A nonempty draft and the learner’s review checks record practice completion, **not writing proficiency**. No grammar score, AI feedback, listening assessment, audio recording, or educator dashboard is implemented here. Word counts in prompts are guidance, not automatic grading criteria. Reading accuracy is not folded into the existing profile score.

## Resources consulted

Accessed 29 October 2026. These public British Council resources informed the language targets and preparation/model/practice structure. All LitSpark stories, questions, distractors, feedback, and model messages were authored for the app. No textbook pages, worksheets, video transcripts, media files, or user comments were copied. No affiliation or endorsement is claimed.

- [How to be polite in English](https://www.britishcouncil.in/blog/how-be-polite-english): requests and respectful opinions. Informs Units 1 and 3.
- [Making plans — LearnEnglish Teens](https://learnenglishteens.britishcouncil.org/skills/speaking/a2-speaking/making-plans): an A2 video lesson with preparation, transcript, and practice. Informs the functions in Unit 2; our library scenario and questions are independent.
- [Messaging to make plans — LearnEnglish](https://learnenglish.britishcouncil.org/free-resources/writing/a2/messaging-make-plans): suggestions, proposing an alternative, and message planning. Informs Unit 2 language guidance.
- [Giving your opinion — LearnEnglish Teens](https://learnenglishteens.britishcouncil.org/skills/speaking/a2-speaking/giving-your-opinion): an A2 video lesson with comprehension and language practice. Informs Unit 3’s preference and response focus; the club story and because scaffolding are original.

Links open externally from each unit and require internet. The core lessons use bundled content and local storage and do not require access to those services. Check link availability periodically. Videos are supplementary, not embedded or required for completion.

## Implementation and saved data

- `content/learningUnit.ts`: typed catalogue, stable unit/draft IDs, answer keys, support, and source links.
- `lib/journeyState.ts`: per-unit progress, sequential unlocking, rewards and legacy decoding.
- `components/UnitSupport.tsx`: preparation, saved warm-up, example disclosure, and external resources.
- `screens/UnitScreen.tsx`: shared activity flow; `JourneyScreen.tsx` shows all three paths; `HomeScreen.tsx` resumes the first unfinished unit.
- `contexts/ProgressContext.tsx`: unit-aware storage mutations. Existing callers default to Unit 1.

Each first-completed reading/writing/review activity earns 10 XP: 30 per unit, 90 for all three. Rewards are idempotent across repeated taps, replays, reloads, and retrying writes. Units 2 and 3 unlock after the previous unit’s review. Both route guards and pure transitions enforce prerequisites; completion summaries require a completed review.

Existing Unit 1 reading keys, three activity IDs, checklist shape, draft ID, totals, reviewed snapshot, and rewards are preserved. Older records acquire empty warm-up answers without losing progress or having to repeat completed work. New units have separate drafts, checks, and snapshots. Editing one draft clears only that unit’s self-checks; it never removes historical rewards or relocks a later unit. Storage remains on-device/on-browser: no account sync or cloud backup.

## Validation and release follow-up

Run `npm run typecheck` and `npm run test:reliability`. The added tests cover catalogue integrity, all-unit completion and decoding, prerequisites, per-unit draft isolation, warm-up persistence/validation, old save migration, and reward replay. Existing reliability/streak tests remain in place.

Before release: ask an ESL educator to review the content, run a small learner pilot (observe comprehension, time and revision quality), test native Dynamic Type and screen readers on real devices, and revise ambiguous distractors or overly difficult passages based on findings. Do not describe these units as a validated course or use self-review to place students into a CEFR level.
