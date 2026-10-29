# Architecture and current limitations

## Application

Expo Router uses files under `app/` as routes. `app/_layout.tsx` wraps the stack in profile and progress providers. Views use React Native, with both NativeWind classes and StyleSheet styles. Shared UI colors live in `constants/theme.ts`.

The current repository also puts components, data, and types under `app/`. Expo emits route warnings for several of those files. A lead-approved cleanup should move non-route files outside `app/` and update imports; do not mix that migration into unrelated content changes.

## Learning content

`app/data/stories.ts` contains four stories conforming to `app/types/story.ts`. `readingMod.tsx` manages library → reader → quiz → completion through local view state. `QuizView.tsx` handles multiple-choice scoring. Reading completion currently disappears when the screen is recreated.

`app/data/modules.ts` contains twelve situational modules. Module routes show content, practice questions, and a completion view. There is no dedicated writing editor or shared unit/lesson pathway.

## Storage

`ProgressContext.tsx` and `UserProfileContext.tsx` load/save JSON in AsyncStorage. There is no account authentication or cloud sync in this repository. Both providers currently start saving before asynchronous hydration is complete; fix this before extending persistence. Plan migration/default handling for older saved data.

Speaking time drives current practice levels and XP. Session counting is tied to speaking-time updates. Streak and achievement behavior need an audit; do not assume every visible reward is wired to completion.

## External AI service

`chat.tsx` and `conversation.tsx` hardcode the same hosted backend URL. The client calls `/api/chat`, `/api/transcribe`, and `/api/tts`. Backend implementation, provider credentials, deployment, and verified retention policies are outside this repository.

Before AI work, obtain a lead-approved test environment and document request/response contracts. A future central API configuration should separate development and production endpoints. A client environment variable is configuration, not a way to keep secrets.

## Known engineering tasks

- Persist story completion and writing drafts with stable IDs.
- Fix storage hydration ordering and add migration handling.
- Establish application tests and lint configuration.
- Address Expo dependency compatibility warnings and renderer/React mismatch.
- Review native project differences before prebuild/regeneration.
- Review the legacy EAS pre-install hook: it uses sudo, broad permissions, deletes node_modules, and reinstalls packages. Do not run it locally; replace or justify it in a dedicated release task.
- Confirm API error handling, microphone denial behavior, and session accounting with device testing.

Native projects are committed. Preserve them unless a lead approves a migration; regenerating them can discard native configuration.
