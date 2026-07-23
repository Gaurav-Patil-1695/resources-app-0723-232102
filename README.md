# App Backend

Express + Knex + PostgreSQL REST API service.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup](#setup)
3. [Environment Variables](#environment-variables)
4. [Database Migrations](#database-migrations)
5. [Running the Server](#running-the-server)
6. [Testing](#testing)
7. [Module Dependency Direction (ADR)](#module-dependency-direction-adr)

---

## Prerequisites

| Tool | Minimum version |
|------|-----------------|
| Node.js | 18.x |
| npm | 9.x |
| PostgreSQL | 14.x |
| Elasticsearch | 8.x (optional) |

---

## Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd <repo-directory>

# 2. Install dependencies
npm install

# 3. Copy the environment template and fill in your values
cp .env.example .env

# 4. Create the development database (if it does not exist)
createdb app_development

# 5. Run migrations
npm run migrate:latest

# 6. (Optional) Seed development data
npm run seed:run
```

---

## Environment Variables

All variables are documented in [`.env.example`](.env.example).  
Copy that file to `.env` and edit each value before starting the server.

| Variable | Description | Default |
|---|---|---|
| `NODE_ENV` | Runtime environment (`development` / `test` / `production`) | `development` |
| `PORT` | HTTP port the server binds to | `3000` |
| `DB_HOST` | PostgreSQL host | `127.0.0.1` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `app_development` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | *(empty)* |
| `DB_SSL_REJECT_UNAUTHORIZED` | Reject invalid SSL certs in production | `true` |
| `TEST_DB_HOST` | PostgreSQL host for tests | `127.0.0.1` |
| `TEST_DB_PORT` | PostgreSQL port for tests | `5432` |
| `TEST_DB_NAME` | Database name for tests | `app_test` |
| `TEST_DB_USER` | Database user for tests | `postgres` |
| `TEST_DB_PASSWORD` | Database password for tests | *(empty)* |
| `JWT_SECRET` | Secret key for signing JWTs | **required** |
| `JWT_EXPIRES_IN` | JWT expiry (ms format, e.g. `1h`) | `1h` |
| `BCRYPT_SALT_ROUNDS` | bcrypt cost factor | `12` |
| `ELASTICSEARCH_NODE` | Elasticsearch base URL | `http://localhost:9200` |
| `ELASTICSEARCH_API_KEY` | Elasticsearch API key | *(empty)* |
| `RATE_LIMIT_WINDOW_MS` | Rate-limit window in milliseconds | `900000` |
| `RATE_LIMIT_MAX` | Max requests per window per IP | `100` |
| `LOG_LEVEL` | Winston log level | `info` |
| `LOG_DIR` | Directory for log files | `logs` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins | `http://localhost:3000` |

---

## Database Migrations

Migration files live in `src/database/migrations/`.  
Knex is configured via [`knexfile.js`](knexfile.js) and reads connection details from `.env`.

```bash
# Apply all pending migrations
npm run migrate:latest

# Roll back the most recent migration batch
npm run migrate:rollback

# Create a new migration file
npm run migrate:make -- <migration_name>

# Run seed files
npm run seed:run
```

To target a specific environment, prefix with `NODE_ENV`:

```bash
NODE_ENV=production npm run migrate:latest
```

---

## Running the Server

```bash
# Development (auto-restarts on file changes via nodemon)
npm run dev

# Production
npm start
```

---

## Testing

Tests use **Jest** and **supertest**. A dedicated PostgreSQL database (`TEST_DB_NAME`) is required.

```bash
# Create the test database once
createdb app_test

# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Watch mode during development
npm run test:watch
```

Coverage thresholds (configured in `jest.config.js`):

| Metric | Minimum |
|--------|---------|
| Statements | 80 % |
| Lines | 80 % |
| Functions | 80 % |
| Branches | 70 % |

---

## Module Dependency Direction (ADR)

### Decision

All imports MUST flow strictly in one direction:

```
Routes → Controllers → Services → Repositories → Database
```

Cross-cutting concerns (logging, config, validation schemas, utilities) may be imported by any layer.

### Rationale

- **Testability** — lower layers have no knowledge of higher layers, making them trivially mockable in unit tests.
- **Replaceability** — swapping a transport layer (e.g. HTTP → gRPC) requires changes only in routes/controllers.
- **Cycle prevention** — ESLint rule `import/no-cycle` and `import/no-restricted-paths` (configured in `.eslintrc.js`) enforce this at lint time, giving immediate feedback during development and in CI.

### Rules

| Layer | May import from | Must NOT import from |
|---|---|---|
| `routes/` | `controllers/`, cross-cutting | `services/`, `repositories/` |
| `controllers/` | `services/`, cross-cutting | `routes/`, `repositories/` |
| `services/` | `repositories/`, cross-cutting | `routes/`, `controllers/` |
| `repositories/` | `database/`, cross-cutting | `routes/`, `controllers/`, `services/` |

Violations cause a CI lint failure and must be corrected before merging.
