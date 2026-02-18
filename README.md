# Ritmio API

Backend API for **Ritmio** - a habit and daily task tracking product.

This repository contains the NestJS backend with authentication, profile management, tasks/subtasks, email verification, password recovery, and async email processing.

## Current Capabilities

- User registration and login sessions
- JWT-based auth (access token + token refresh endpoint)
- Profile endpoints (`me`, update name/email/password)
- Email verification flow with token statuses (`pending`, `sent`, `used`, `expired`, `failed`)
- Password recovery (forgot/reset)
- Task management for authenticated users
- Nested subtasks under parent tasks
- Swagger API docs
- Async mail jobs with BullMQ + Redis
- MariaDB persistence via TypeORM migrations

## Tech Stack

- Node.js 20+
- TypeScript
- NestJS 11
- TypeORM
- MariaDB
- Redis
- BullMQ
- Swagger (`/api`)
- Jest (unit + e2e)

## Prerequisites

- Node.js >= 20
- Yarn 1.x
- Docker + Docker Compose

## Quick Start

1. Clone and install dependencies:

```bash
yarn install
```

2. Create local env file:

```bash
cp .env.example .env
```

3. Start infrastructure:

```bash
docker-compose up -d
```

4. Run database migrations:

```bash
yarn migration:run
```

5. Start API in dev mode:

```bash
yarn start:dev
```

API will start on `http://localhost:8080` by default.  
Swagger docs: `http://localhost:8080/api`.

## Environment Variables

Use `.env.example` as base.

### App

- `APP_HOST` - API host (default `localhost`)
- `APP_PORT` - API port (default `8080`)
- `APP_ENV` - environment (`local`, `dev`, `stage`, `production`)

### Frontend Links (used in email links)

- `FRONT_BASE_URL`
- `FRONT_PASSWORD_RECOVERY_PATH`
- `FRONT_EMAIL_VERIFICATION_PATH`

### Auth / Session

- `JWT_SECRET` - required
- `SESSION_LIFETIME` (minutes, optional, default `120`)
- `SESSION_REFRESH_THRESHOLD` (minutes, optional, default `60`)
- `SESSION_PASSWORD_RECOVERY_LIFETIME` (minutes, default `60`)

### Database

- `DB_HOST`
- `DB_PORT`
- `DB_DATABASE`
- `DB_USER`
- `DB_PASSWORD`

### Redis / Queues

- `REDIS_HOST`
- `REDIS_PORT` (optional, default `6379`)
- `REDIS_USERNAME` (optional, default `default`)
- `REDIS_PASSWORD`

### SMTP (optional in local development)

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USERNAME`
- `SMTP_PASSWORD`
- `SMTP_SECURE`
- `SMTP_TLS`
- `EMAIL_FROM`
- `EMAIL_REPLY_TO`

If SMTP is not configured, the API logs verification/recovery links and skips real email sending.

## Scripts

- `yarn start` - start app
- `yarn start:dev` - start in watch mode
- `yarn start:prod` - run compiled app
- `yarn build` - build to `dist/`
- `yarn lint` - lint with autofix
- `yarn format` - format source and tests
- `yarn test` - unit tests
- `yarn test:e2e` - e2e tests
- `yarn test:cov` - coverage report

## Migrations

- `yarn migration:run` - apply migrations
- `yarn migration:revert` - rollback last migration
- `yarn migration:generate ./src/database/migrations/<name>` - generate migration

## Main API Areas

- `POST /api/v1/users` - registration
- `GET /api/v1/users/verify-email` - verify email
- `POST /api/v1/users/resend-verification` - resend verification email
- `POST /api/v1/sessions` - login
- `GET /api/v1/sessions/new-token` - refresh token
- `DELETE /api/v1/sessions` - logout
- `POST /api/v1/password/forgot` - request password reset
- `POST /api/v1/password/reset` - reset password
- `GET /api/v1/users/me` - get profile
- `PATCH /api/v1/users/me/name` - update name
- `PATCH /api/v1/users/me/email` - update email
- `PATCH /api/v1/users/me/password` - change password
- `GET/POST/PATCH/DELETE /api/v1/users/me/tasks...` - tasks and subtasks CRUD