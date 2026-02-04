# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains the NestJS application entry points (`main.ts`, `app.module.ts`) and feature modules under `src/modules/` (e.g., `tasks/`, `users/`).
- Shared concerns live in `src/common/` (auth, decorators, DTOs, exceptions, validators, etc.).
- Database setup and migrations are in `src/database/` and `src/database/migrations/`.
- Tests live under `test/` for E2E and in-module `*.spec.ts` files for unit tests.
- Build output is emitted to `dist/`.

## Build, Test, and Development Commands
- `yarn start` runs the API locally with default settings.
- `yarn start:dev` runs in watch mode for development.
- `yarn build` compiles TypeScript to `dist/`.
- `yarn start:prod` runs the compiled app (`node dist/main`).
- `yarn lint` runs ESLint with auto-fix enabled.
- `yarn format` runs Prettier on `src/**/*.ts` and `test/**/*.ts`.
- `yarn test`, `yarn test:cov`, `yarn test:e2e` run unit tests, coverage, and E2E tests respectively.
- `yarn migration:generate ./src/database/migrations/{name}` generates a TypeORM migration.
- `yarn migration:run` and `yarn migration:revert` manage migrations.

## Coding Style & Naming Conventions
- TypeScript, NestJS patterns, and class-based modules/services/controllers.
- Files use kebab-case with suffixes like `.module.ts`, `.service.ts`, `.controller.ts`, `.dto.ts`, `.entity.ts`.
- Linting via ESLint + `typescript-eslint`; formatting via Prettier. Prefer running `yarn lint` and `yarn format` before commits.
- Avoid `any` unless necessary; async/promise safety is enforced with warnings.

## Testing Guidelines
- Jest is the primary test runner; unit tests use `*.spec.ts`.
- E2E tests live in `test/` and are run with `yarn test:e2e`.
- No explicit coverage threshold is configured; add coverage for new behaviors.

## Commit & Pull Request Guidelines
- Commit messages follow Conventional Commits (e.g., `feat: add task due date`, `fix: handle empty payload`).
- PRs should include a concise summary, testing performed (commands and results), and any migration steps if schema changes are involved.
- Link relevant issues and note breaking changes or config updates (`.env`, Docker, migrations).

## Configuration & Local Setup
- Create `.env` from `.env.example` and fill required values.
- Use `docker-compose up -d` for local services (e.g., database/redis) before running the API.
