# Budget Tracker Project

This is a budget tracking application with a web frontend and backend services for receipt processing and budget management via Google Spreadsheets.

## Project Structure

This is a Turborepo monorepo using pnpm for package management.

- `apps/web/` - Next.js 16 web application with App Router
  - Receipt upload and processing interface
  - Receipt item management and categorization
  - Quick expense entry and management
  - Unified expense list (receipts + quick expenses)
  - Integration with Google Spreadsheets for budget tracking
  - Azure Cosmos DB for receipt and quick expense data storage
- `apps/functions/` - Azure Functions backend services
  - Receipt processing and data enrichment
  - Azure Blob Storage integration for receipt images
- `packages/shared/` - Shared TypeScript schemas and utilities
  - Expense data schemas (receipts, quick expenses, unified expenses)
  - Currency support with exchange rates
  - Payment participant schemas

## Key Features

- Upload receipt images to Azure Blob Storage
- AI-powered receipt data extraction and enrichment
- Manual editing of receipt items (merchant, date, items, categories)
- Quick expense entry for expenses without receipts
- Multi-currency support (PLN, PHP) with automatic conversion
- Payment participant tracking (who paid, with share percentages)
- Unified expense list combining receipts and quick expenses
- Validation against existing Google Spreadsheet entries to prevent duplicates
- Send receipts and quick expenses to budget spreadsheet with category breakdown

## Processing Pipeline Architecture

The application uses a serverless event-driven architecture with Azure Functions to process receipts through three stages. Real-time status updates are provided to users via Server-Sent Events (SSE).

### Pipeline Stages

```
User Upload → [uploaded] → Receipt Reader → [read] → Data Enricher → [enriched] → Notify Web App
```

#### Stage 1: Upload (`uploaded`)

**Location:** Web application ([create-processing-bundle.ts](../apps/web/src/lib/processing-bundle/create-processing-bundle.ts))

1. User uploads receipt image(s) via drag-and-drop or file picker
2. Web app creates a processing bundle with unique ID in Cosmos DB
3. Images uploaded to Azure Blob Storage: `receipts/{bundleId}/{receiptId}.{ext}`
4. Processing status set to `"uploaded"`
5. User redirected to `/processing-bundles/{bundleId}` for real-time status

#### Stage 2: Extract Data (`read`)

**Trigger:** Azure Blob Storage trigger
**Function:** `receipt-reader` ([receipt-reader.ts](../apps/functions/src/functions/receipt-reader.ts))
**Processing:** [receipt-reader/index.ts](../apps/functions/src/lib/receipt-reader/index.ts)

1. Function automatically triggered when image uploaded to blob storage
2. Uses **Azure Form Recognizer** (Document Intelligence) with prebuilt receipt model
3. Extracts raw data:
   - Merchant name
   - Total amount
   - Transaction date and time
   - Line items (product names and prices)
4. Saves to Cosmos DB `receipts-raw` container as `ReceiptRawData`
5. Updates processing bundle status to `"read"`

#### Stage 3: Enrich Data (`enriched`)

**Trigger:** Cosmos DB change feed on `receipts-raw` container
**Function:** `data-enricher` ([data-enricher.ts](../apps/functions/src/functions/data-enricher.ts))
**Processing:** [data-enricher/index.ts](../apps/functions/src/lib/data-enricher/index.ts)

1. Function triggered by Cosmos DB change feed when raw receipt created
2. Uses **OpenAI Assistant API** with thread-based conversation
3. Enriches data:
   - Categorizes each item
   - Improves product names (expands abbreviations, uses full names)
   - Improves merchant names (common name vs legal name)
   - Handles discounts by merging with original items
   - Validates and structures data
4. Saves to Cosmos DB `receipts` container as `EnrichedReceiptData`
5. Updates processing bundle status to `"enriched"`

#### Stage 4: Notify Web App

**Trigger:** Cosmos DB change feed on `receipts` (enriched) container
**Function:** `data-processing` ([data-processing.ts](../apps/functions/src/functions/data-processing.ts))
**Processing:** [data-processing/index.ts](../apps/functions/src/lib/data-processing/index.ts)

1. Function triggered when enriched receipt created
2. Calls web app revalidation endpoint: `{WEB_BASE_URL}/api/revalidate?secret={REVALIDATE_SECRET}`
3. Next.js revalidates home page cache to show new receipt
4. User automatically redirected to receipt details page

### Real-Time Status Updates

**Endpoint:** `/api/processing/[id]` ([route.ts](../apps/web/src/app/api/processing/[id]/route.ts))

- Uses Server-Sent Events (SSE) for real-time updates
- Polls Cosmos DB every 3 seconds for processing bundle status changes
- Sends events: `uploaded`, `read`, `enriched`, or `error`
- Client automatically redirects to receipt details when status is `enriched`
- Connection closes when final status reached

**Components:**

- [ProcessingBundleStatus](../apps/web/src/components/processing-bundles/processing-bundle-status/index.tsx) - Status page UI
- [ProgressStepper](../apps/web/src/components/processing-bundles/progress-stepper/index.tsx) - Visual progress indicator
- [useRedirectToProcessedReceipt](../apps/web/src/components/processing-bundles/processing-bundle-status/use-redirect-to-processed-receipt.tsx) - Auto-redirect hook

### Error Handling

- If any stage fails, processing status set to `"error"`
- Error state displayed in UI with ability to retry upload
- Detailed error logging in Application Insights
- Failed receipts remain in Cosmos DB for debugging

### Key Technical Details

- **Cosmos DB Partition Key:** `userId` (supports multi-user scenarios)
- **Change Feed:** Enables reactive, event-driven processing without polling
- **Processing Bundle Pattern:** Groups multiple receipt uploads for batch status tracking
- **OpenAI Assistant Configuration:** Located in [assistant-instructions.md](../apps/functions/src/lib/data-enricher/resources/assistant-instructions.md)
- **Response Schema:** Validated with Zod using [assistant-response-schema.json](../apps/functions/src/lib/data-enricher/resources/assistant-response-schema.json)
- **Quick Expenses:** Stored in Cosmos DB `quick-expenses` container, support multi-currency (PLN, PHP) with exchange rate conversion
- **Unified Expense List:** Combines receipts and quick expenses on home page, sorted by transaction date (newest first), limited to top 10
- **Currency Support:** Exchange rates defined in [currency.ts](../packages/shared/src/currency.ts), base currency is PLN

## Application Routes

### Page Routes

- **`/`** ([page.tsx](../apps/web/src/app/page.tsx)) - Home page displaying unified list of recent receipts and quick expenses, sorted by date
- **`/receipts/add`** ([page.tsx](../apps/web/src/app/receipts/add/page.tsx)) - Upload receipt images via drag-and-drop
- **`/receipts/[id]`** ([page.tsx](../apps/web/src/app/receipts/[id]/page.tsx)) - View and edit receipt details (merchant, date, items, categories)
- **`/quick-add`** ([page.tsx](../apps/web/src/app/quick-add/page.tsx)) - Create new quick expense manually (name, amount, currency, category, payment participants)
- **`/quick-expenses/[id]`** ([page.tsx](../apps/web/src/app/quick-expenses/[id]/page.tsx)) - View and edit quick expense details
- **`/processing-bundles/[id]`** ([page.tsx](../apps/web/src/app/processing-bundles/[id]/page.tsx)) - Real-time processing status with SSE updates

### API Routes

- **`GET /api/processing/[id]`** ([route.ts](../apps/web/src/app/api/processing/[id]/route.ts)) - SSE endpoint that polls Cosmos DB every 3 seconds for processing status updates
- **`GET /api/revalidate`** ([route.ts](../apps/web/src/app/api/revalidate/route.ts)) - Cache revalidation endpoint (protected by secret) called by Azure Functions after processing

## Development Commands

All commands should be run from the root directory using pnpm.

- **Dev (all apps)**: `pnpm dev` - Start all apps in parallel
- **Build (all apps)**: `pnpm build` - Build all apps with Turborepo caching
- **Lint (all apps)**: `pnpm lint` - Lint all apps
- **Specific app commands**: Use `pnpm --filter <app-name> <script>`
  - `pnpm --filter web dev` - Start Next.js dev server
  - `pnpm --filter functions start` - Start Azure Functions
  - `pnpm --filter functions deploy` - Deploy Functions to Azure

## Code Style Guidelines

### TypeScript

- TypeScript with strict mode enabled across all projects
- Always use semicolons at the end of statements
- Place types below the function signature
- Prefer arrow functions without explicit return types unless necessary
- Prefer `type` over `interface` for consistency

### Control Flow

- Always use brackets for control statements, even single-line ones
- Handle errors with try/catch and proper logging
- Return early to avoid deep nesting

### React & Next.js

- Use React hooks for state management
- Use Next.js App Router pattern (app directory)
- Mark server-side functions with `"use server"` directive
- Mark client components with `"use client"` directive
- Use React Server Actions for mutations
- Use `useTransition` for async state updates in client components
- Custom hooks should start with `use` prefix

### Code Organization

- Follow consistent import ordering: external deps first, then internal
- Group related functionality in custom hooks
- Keep components focused on presentation, move logic to hooks
- Use functional programming patterns where possible

### Styling

- Use Tailwind CSS for styling components
- Use shadcn/ui components as base
- Follow mobile-first responsive design

### Performance

- Debounce frequent operations (e.g., auto-save)
- Skip validation/processing when data hasn't changed

## Development Workflow

### Testing & Type Checking

- Test changes thoroughly before committing
- Run type checks before committing: `pnpm type-check`
- Validate data before writing to external systems (Cosmos DB, Google Sheets)

### Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Be concise but descriptive
- Reference issue numbers when applicable
- Do NOT include AI attribution in commit messages
