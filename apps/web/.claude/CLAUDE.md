# Budget Tracker Web Application

Next.js web application for tracking receipts and managing budgets.

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Azure Cosmos DB and Azure Blob Storage
- **Google Integration**: Google Sheets API for budget exports
- **Language**: TypeScript

## Project Structure

- `src/app/` - Next.js app router pages and API routes
- `src/components/` - React components organized by feature
  - `receipt/` - Receipt management components
  - `processing-bundles/` - Receipt processing workflow
  - `ui/` - Shared UI components (shadcn/ui)
- `src/lib/` - Utility functions and business logic
  - `receipt-data/` - Cosmos DB operations for receipts
  - `google-spreadsheet/` - Google Sheets integration
  - `processing-bundle/` - Processing workflow logic
  - `storage/` - Azure Blob Storage operations
- `src/models/` - Zod schemas for data validation

## Development Guidelines

- Use TypeScript with strict mode
- Follow React 19 and Next.js 15 best practices
- Use shadcn/ui components from `src/components/ui/shadcn/`
- Validate data with Zod schemas from `src/models/`
- Use Tailwind CSS for styling with the `cn()` utility from `src/lib/utils/`
- Keep components focused and single-responsibility
- Use server components by default, client components only when needed
- Handle errors gracefully with proper error boundaries

## Available Scripts

- `yarn dev` - Start development server with Turbopack
- `yarn build` - Build for production
- `yarn lint` - Run ESLint
- `yarn migration` - Run database migrations

## Key Features

- Receipt upload and processing
- Item categorization and price tracking
- Google Sheets export for budget tracking
- Real-time processing status updates
- Mobile-responsive design
