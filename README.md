# Teacher Administration API

Node.js API implementing the teacher/student administration assessment with Next.js route handlers and MySQL.

## Requirements

- Node.js 20+
- MySQL 8+

## Setup

```bash
pnpm install
cp .env.example .env
mysql -u root -p < scripts/schema.sql
pnpm dev
```

Configure `DATABASE_URL` in `.env`, for example `mysql://root:password@localhost:3306/teacher_admin`.

Run `pnpm prisma generate` after installing dependencies. Both Prisma CLI and the application use `DATABASE_URL`.

## Endpoints

- `POST /api/register` with `{ "teacher": "teacher@example.com", "students": ["student@example.com"] }` returns `200`.
- `GET /api/commonstudents?teacher=teacher@example.com&teacher=other@example.com` returns `{ "students": [] }`.
- `POST /api/suspend` with `{ "student": "student@example.com" }` returns `204`.
- `POST /api/retrievefornotifications` with `{ "teacher": "teacher@example.com", "notification": "Hello @student@example.com" }` returns `{ "recipients": [] }`.

All errors return `{ "message": "..." }`. Authentication and access control are intentionally assumed to be provided externally, as specified by the assessment.

## Verification

```bash
pnpm test
pnpm build
```

## Tests

The API service modules are designed for dependency-injected unit tests. A live MySQL instance is required for integration testing of the route handlers.
