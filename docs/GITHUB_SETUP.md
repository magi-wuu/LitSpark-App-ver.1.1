# GitHub setup and release preparation

## Before upload

- Review `git status` and the diff, including existing app configuration and native files.
- Keep `package-lock.json`; exclude node_modules, build outputs, local environment files, and release signing credentials.
- Run a secret scanner on both the working tree and Git history before making the repository public. A simple pattern scan is not a full security audit. Rotate any exposed secret; deleting a current file does not remove history.
- `android/app/debug.keystore` is the committed development signing file, not a production signing credential. Never commit a release keystore.
- Choose repository visibility and code/content/brand licensing with leadership. A private pilot repository is a reasonable initial choice.
- Confirm that any uploaded learning content and assets can be shared. The program planning PDF is not copied into this repository.

## Upload the existing repository

Create an empty GitHub repository under the intended LitSpark owner. Do not initialize it with another README. Then, from this folder:

```sh
git status
git remote -v
```

Review and stage the intended changes, then commit. Add the actual GitHub URL as a remote if none exists; otherwise check the current remote before changing it. Push your existing branch and select the intended default branch in GitHub. Do not force-push existing history. This guide intentionally does not invent an organization or repository URL.

## GitHub settings to configure

- Invite interns with the minimum repository access their role needs.
- Protect the default branch: require PRs, lead review, and the `Typecheck` check; restrict force pushes and deletion. Available enforcement features depend on GitHub plan and repository visibility.
- Once reviewer usernames/team names are known, add CODEOWNERS for content, app changes, and release configuration.
- Enable available dependency/security alerts and secret scanning.
- Create labels: reading, writing, pathway, progress, accessibility, bug, documentation, good first issue.
- Create a project board: Backlog → Ready → In progress → In review → Done.
- Populate issues from `docs/ROADMAP.md`, with acceptance criteria and owners.
- Set maintainer contacts, cohort communication channels, and review expectations during onboarding.

Local files do not configure branch protection, access, or repository visibility automatically.

## Release policy for the pilot

Interns submit PRs; authorized maintainers own releases. Before any EAS build or submission, review `app.json`, `eas.json`, and the legacy `eas-build-pre-install.js` hook. Existing EAS project and store identifiers are deployment configuration, not permission to release.

A release candidate needs passing checks, reading/writing content review, affected-flow QA on target devices, a review of migrations and API behavior, release notes, and maintainer approval. Use approved test accounts and environments. Record build version and rollback/recovery steps with the release.
