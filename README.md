# RAHA React

Stage 0 development setup for RAHA's planned React migration. The current UI is still the Vite starter; no Day 3 modules or storefront components have been migrated. The original shopboard project is read-only.

## Project root

Run commands from C:/Users/morjm/OneDrive/Desktop/shopboard-react/shopboard-react, where package.json lives. This directory has its own local Git repository, independent of parent directories and Day 3. No remote or initial commit has been created; all files are left unstaged for review.

Use Node.js 22.22.1 or newer (also required by the installed lint-staged version) and npm. Stage 0 was verified with Node 26.13.0 and npm 11.20.0. On PowerShell use npm.cmd if execution policy blocks npm.ps1.

## Commands

```sh
npm ci
npm run dev
npm run build
npm run preview
npm run lint
npm run typecheck
npm run format:check
npm run format
```

Build includes TypeScript and Vite. Typecheck checks both app and Vite configuration without emitting application JavaScript. Lint rejects warnings as well as errors, including prohibited TypeScript shortcuts. Format checks formatting; format applies it. Formatting and lint skip third-party skill packages to preserve their upstream content.

## Pre-commit checks

The prepare script installs Husky's repository-local hooks during npm install/npm ci. .husky/pre-commit runs npm run lint-staged: staged JavaScript/TypeScript files are formatted then linted with zero warnings; staged JSON/CSS/HTML/Markdown/YAML files are formatted. No test runner or tests have been added in Stage 0.

No files were staged and no commit was made to demonstrate the hook. The hook was invoked directly and reached lint-staged successfully; with no staged files it had no file tasks to run. Its no-initial-commit backup warning is expected. Full staged-file execution will occur when an initial commit is explicitly approved.

## Project-local skills

Both required skills are installed as real copied files, including their rules and supporting documents:

- .claude/skills/vercel-react-best-practices/
- .claude/skills/vercel-composition-patterns/

Source: [Vercel agent-skills](https://github.com/vercel-labs/agent-skills). skills-lock.json records source paths, content hashes and copy mode. These files are eligible for tracking and must be included in a later approved commit; they are not committed yet. Installation alone does not claim the skills' migration reviews were completed.

## Migration documentation

AGENTS.md contains Codex instructions; CLAUDE.md contains course rules. MIGRATION_PLAN.md is temporary planning documentation with the proposed component tree, props/state ownership and Stage 0 record. It must be removed before final submission after approved cleanup. README's final component tree, DESIGN.md, React DevTools verification, debug-lab-log.md and personal learning rules are later-stage deliverables and remain pending.

## Stage 0 verification

Build, lint (zero warnings), typecheck and format:check passed. Both skills contain 90 physical files in total, none ignored by Git and none symlinks. All project files remain unstaged/uncommitted; no remote was configured. No Stage 1 work was performed.
