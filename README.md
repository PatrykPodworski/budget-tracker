# Budget Tracker

A budget tracking application with AI-powered receipt processing and Google Spreadsheets integration. Upload receipt images, extract data with Azure AI, enrich with OpenAI, and automatically sync expenses to Google Sheets with category breakdowns.

## Prerequisites

- Node.js 18+ and Yarn
- Azure account (Cosmos DB, Blob Storage, Form Recognizer)
- Google Cloud service account with Sheets API access
- OpenAI API account

## Project Structure

- `budget-tracker-web/` - Next.js 16 web application with App Router
- `functions/` - Azure Functions backend for receipt processing

## Development Setup

### Web Application

1. Install dependencies:
```bash
cd budget-tracker-web
yarn install
```

2. Copy `.env.example` to `.env.local` and configure your environment variables

3. Run the development server:
```bash
yarn dev
```

4. Type checking:
```bash
npx tsc --noEmit
```

### Azure Functions

1. Install dependencies:
```bash
cd functions
yarn install
```

2. Copy `local.settings.json.example` to `local.settings.json` and configure your environment variables

3. Run the functions locally:
```bash
yarn start
```

## Common Commands

### Web Application
- `yarn dev` - Start Next.js dev server with Turbopack
- `yarn build` - Build for production
- `yarn lint` - Run ESLint
- `npx tsc --noEmit` - Type check without emitting files

### Azure Functions
- `yarn start` - Start Azure Functions locally
- `yarn build` - Build TypeScript
- `yarn deploy` - Deploy to Azure

