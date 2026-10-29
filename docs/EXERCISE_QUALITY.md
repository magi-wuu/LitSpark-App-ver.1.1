# Exercise quality guide

## Every exercise

State who it is for, what the learner will practice, and how completion works. Use respectful, age-appropriate scenarios; do not assume all immigrants share one background. Prefer original or permission-cleared material and record sources/licensing for imported content. Difficulty should reflect vocabulary, syntax, task complexity, and available support, not merely passage length.

A human content reviewer must check accuracy, language, cultural assumptions, instructions, and feedback before release. Track the review in the issue or PR. Do not assume AI-generated content is correct.

## Reading

- Give each passage a clear learning objective and reviewed difficulty.
- Ask questions supported by the passage; inference answers need defensible evidence.
- Use one unambiguously best answer in single-choice questions.
- Write plausible distractors, avoiding accidental clues from option length or grammar.
- Explain why the answer fits; distinguish comprehension from obscure trivia.
- Offer vocabulary help without revealing quiz answers inadvertently.
- Validate stable IDs, nonempty options, and answer-index bounds.

The current `Question` type supports only question text, options, and a zero-based correct answer. Explanations, vocabulary, objectives, and other question formats require deliberate schema/UI updates.

## Writing

- Give an audience, purpose, and manageable task: for example, a short message asking to change meeting time.
- Offer optional sentence starters and vocabulary support.
- Review communication of meaning, organization, useful vocabulary, and language conventions with a simple rubric.
- Give one strength and one or two actionable suggestions. Invite revision.
- Accept multiple valid responses. Sample answers are examples, not exact-match targets.
- Preserve drafts, handle empty submissions clearly, and explain when work is saved.
- If AI feedback is added, evaluate it on varied proficiency levels and valid alternative responses; include failures and unavailable-service behavior.

## Motivation

Reward practice and progress. Define completion, repeat-attempt scoring, XP rules, and lesson unlocks before coding. Keep app levels separate from proficiency claims. Verify that retries and reloads do not accidentally award duplicate progress.
