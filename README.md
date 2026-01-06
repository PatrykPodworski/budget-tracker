# Budget Tracker

A budget tracking application with AI-powered receipt processing and Google Spreadsheets integration. Upload receipt images, extract and enrich data via N8N workflow, and automatically sync expenses to Google Sheets with category breakdowns. Also supports manual quick expense entry for expenses without receipts, with multi-currency support and payment participant tracking.

## Prerequisites

- Node.js 18+ and pnpm
- Azure account (Cosmos DB, Blob Storage)
- Google Cloud service account with Sheets API access
- N8N workflow for receipt processing (Form Recognizer + OpenAI)

## Project Structure

This is a Turborepo monorepo using pnpm for package management.

- `apps/web/` - Next.js 16 web application with App Router
- `packages/shared/` - Shared TypeScript schemas and utilities (expense schemas, currency support)

## Development Setup

1. **Install pnpm** (if not already installed):

```bash
npm install -g pnpm
```

2. **Install dependencies** (from root):

```bash
pnpm install
```

3. **Configure environment variables:**

   - Web: Copy `apps/web/.env.example` to `apps/web/.env.local`

4. **Run development servers:**

```bash
# Start all apps in parallel
pnpm dev

# Or start specific apps:
pnpm --filter web dev
```

## Common Commands

All commands run from the root directory:

### Run All Apps

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps with Turborepo caching
- `pnpm lint` - Lint all apps
- `pnpm type-check` - Type check all apps

### Run Specific Apps

- `pnpm --filter web dev` - Start Next.js dev server with Turbopack
- `pnpm --filter web build` - Build web for production
