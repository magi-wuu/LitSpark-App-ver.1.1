# LitSpark — Intern Onboarding

LitSpark Youth is a nonprofit helping immigrant and ESL learners build English confidence. This app is built with **React Native, Expo, and TypeScript**.

## What you will work on

- Improve the quality and experience of reading exercises.
- Build guided writing exercises with drafts, revision, and helpful feedback.
- Create a learning journey with units, lessons, saved progress, and encouraging gamification.
- Improve UI and accessibility while keeping our navy, blue, yellow theme and chick mascot.

## Architecture: this repository is frontend only

This repo contains the app's screens, exercise content, UI components, and device-local progress. It does **not** contain our backend or external AI service.

```text
Reading / writing / learning journey → frontend in this repo
Chatbot / conversation bot → our separate backend → external AI service
```

**The chatbot and conversation bot are outside your internship scope. Ignore and do not edit `app/chat.tsx` or `app/conversation.tsx`.** You do not need backend access, AI keys, or chatbot testing to work on reading, writing, and the learning journey.

| Location | Purpose |
| --- | --- |
| `app/index.tsx` | Home screen |
| `app/readingMod.tsx` | Reading library and quiz flow |
| `app/components/` | Readers, quizzes, cards, and feedback |
| `app/data/` and `app/types/` | Exercise content and TypeScript models |
| `app/esl/` | Everyday English lessons |
| `contexts/` | Profile and progress stored on the device |
| `constants/theme.ts` | Shared colors |
| `assets/` | Logo, chick mascot, and fonts |

Writing exercises and the connected learning pathway are still to be built. Reading quizzes already exist, but reading completion is not yet persistently saved.

## 1. Install requirements

Download **Node.js 22**, which includes npm and npx, and **Git** first. A code editor such as VS Code is recommended. Download links and platform requirements are listed in [requirements.json](requirements.json).

Open Terminal (or your editor's terminal), navigate to the cloned project folder, and run:

```sh
npm run setup
```

This command reads `requirements.json` and downloads all app packages declared in `package.json`, using the exact versions in `package-lock.json`. It installs Expo locally too, so you do not need a global Expo installation. `npm ci` is the equivalent direct package-install command.

**Node.js, Git, Xcode, and simulator runtimes are system tools: install them separately using the links in the requirements file.** The setup command installs project packages, not those system applications.

An Expo account is useful for shared builds and Expo services. You do not need an account just to start the app locally; ask your lead if team build access is needed.

## 2. Start the app

In the project folder's terminal, run:

```sh
npm start
```

Or use Expo directly:

```sh
npx expo start
```

Keep that terminal running. Press **`w`** to open the web version in your browser.

## 3. Run the iPhone simulator

The **iPhone simulator requires a Mac running macOS and Xcode**. Windows and Linux users can start with the web version or use an android simulator if you have that available to you.

1. Install Xcode from the Mac App Store and open it to finish its first-time setup.
2. Install an iOS Simulator runtime in Xcode's Settings → Components (called Platforms in some versions).
3. Open the simulator through Xcode → Open Developer Tool → Simulator and select an iPhone.
4. Run `npm start` or `npx expo start` in this project's terminal.
5. Press **`i`** in that running terminal to launch the app in the simulator.

This project uses Expo SDK 53. If Expo reports a client version mismatch, ask your lead for a compatible client or development build. Avoid upgrading the project just to match the newest Expo Go.

The Mac requirement applies to the simulator; a physical iPhone is a different testing option. See [Expo's simulator guide](https://docs.expo.dev/workflow/ios-simulator/) for setup help.

## Your first contribution

1. Run a reading quiz and an everyday English lesson.
2. Agree on a small issue with your lead.
3. Create a branch, make your change, and check it:

```sh
npm run typecheck
```

4. Open a pull request with a short explanation, validation notes, and screenshots for UI changes.

Read [CONTRIBUTING.md](CONTRIBUTING.md) for the workflow, [the roadmap](docs/ROADMAP.md) for priorities, and [the exercise quality guide](docs/EXERCISE_QUALITY.md) before adding learning content.
