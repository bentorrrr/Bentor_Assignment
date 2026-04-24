# People Registry

**Patcharaphon Santhitikul (Bentor)** — Tests Assignment

A web application for managing a registry of people — create, view, edit, and soft-delete person records with full form validation.

---

## Tech Stack

- **Next.js 16** — App Router, Server Components, API Routes
- **PostgreSQL 16** — via Docker
- **Prisma 7** — ORM with driver adapter
- **Tailwind CSS 4** — styling
- **React Hook Form + Zod** — form handling and validation
- **Vitest** — unit testing

---

## Prerequisites

Make sure you have these installed before starting:

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| pnpm | any |
| Docker | any |

> Don't have pnpm? Run `npm install -g pnpm` to install it.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/bentorrrr/Bentor_Assignment.git
cd Bentor_Assignment
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```bash
cp .env .env.local
```

The default values already match the Docker setup below — no changes needed for local development:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:15432/bentor_assignment"
```

### 4. Start the database

```bash
docker compose up -d
```

This starts a PostgreSQL 16 container on port **15432**.

### 5. Run database migrations

```bash
pnpm prisma migrate deploy
```

This creates the `Person` table and applies all migrations.

### 6. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Using the App

| Action | How |
|--------|-----|
| **Add a person** | Click **+ Add** in the top right |
| **View details** | Click the eye icon on any row |
| **Edit a record** | Click the pencil icon on any row |
| **Delete a record** | Click the trash icon → confirm in the dialog |
| **Search** | Type in the search box (filters by name or address) |
| **Pagination** | Use the page buttons at the bottom of the table |

**Form fields:**
- **ชื่อ / สกุล** — Thai or English letters only, max 50 characters each
- **วันเกิด** — date picker, cannot be a future date; age is calculated automatically
- **ที่อยู่** — free text, max 200 characters

> Deleted records are soft-deleted — they are hidden from the UI but remain in the database.

---

## Available Scripts

```bash
pnpm dev          # Start development server with hot reload
pnpm build        # Build for production
pnpm start        # Run production build
pnpm lint         # Run ESLint
pnpm test         # Run tests in watch mode
pnpm test:run     # Run tests once
```

---

## Project Structure

```
src/
├── app/
│   ├── api/persons/        # REST API routes
│   ├── page.tsx            # Home page (server component)
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Tailwind + theme tokens
├── components/
│   ├── persons/            # PersonsTable, PersonModal
│   └── shared/             # Modal, Button
├── lib/
│   ├── prisma.ts           # Prisma client
│   ├── person/ageUtils.ts  # Age calculation
│   └── validations/        # Zod schemas
└── types/                  # TypeScript interfaces
prisma/
├── schema.prisma           # Data model
└── migrations/             # Migration history
```

---

## API Reference

Base URL: `http://localhost:3000`

### List people
```
GET /api/persons?search=<query>
```
Returns all non-deleted records. Optional `search` param filters by first name, last name, or address (case-insensitive).

### Get one person
```
GET /api/persons/:id
```
Returns 404 if the record does not exist or has been deleted.

### Create a person
```
POST /api/persons
Content-Type: application/json

{
  "firstName": "สมชาย",
  "lastName": "ใจดี",
  "dateOfBirth": "1990-05-15",
  "address": "123 ถนนสุขุมวิท กรุงเทพฯ"
}
```

### Update a person
```
PUT /api/persons/:id
Content-Type: application/json

{ ...same fields as POST... }
```

### Delete a person (soft delete)
```
DELETE /api/persons/:id
```
Sets `isDeleted = true`. Returns `204 No Content`.

---

## Troubleshooting

**Cannot connect to the database**
Make sure Docker is running and the container is up:
```bash
docker compose ps
docker compose up -d
```

**Prisma client is out of sync**
If you pull new schema changes, regenerate the client:
```bash
pnpm prisma generate
```

**Port 15432 is already in use**
Another process is using the port. Stop it or change the port in `docker-compose.yml` and `.env.local`.
