# Budget Tracker

A budget tracking application with AI-powered receipt processing and Google Spreadsheets integration. Upload receipt images, extract data with Azure AI, enrich with OpenAI, and automatically sync expenses to Google Sheets with category breakdowns.

## Prerequisites

- Node.js 18+ and pnpm
- Azure account (Cosmos DB, Blob Storage, Form Recognizer)
- Google Cloud service account with Sheets API access
- OpenAI API account

## Project Structure

This is a Turborepo monorepo using pnpm for package management.

- `apps/web/` - Next.js 16 web application with App Router
- `apps/functions/` - Azure Functions backend for receipt processing
- `packages/` - Shared packages (ready for future use)

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
   - Functions: Copy `apps/functions/local.settings.json.example` to `apps/functions/local.settings.json`

4. **Run development servers:**
```bash
# Start all apps in parallel
pnpm dev

# Or start specific apps:
pnpm --filter web dev
pnpm --filter functions start
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
- `pnpm --filter functions start` - Start Azure Functions locally
- `pnpm --filter functions build` - Build functions TypeScript
- `pnpm --filter functions deploy` - Deploy functions to Azure

