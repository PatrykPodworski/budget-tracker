# Budget Tracker Development Guide

## Commands
- **Web**: `cd budget-tracker-web && yarn dev` - Start Next.js dev server
- **Functions**: `cd functions && yarn start` - Start Azure Functions
- **Bot**: `cd bot && yarn dev` - Start bot in dev mode
- **Lint/Fix**: `yarn lint` (in respective directories)
- **Build**: `yarn build` (in respective directories)
- **Deploy Functions**: `cd functions && yarn deploy`

## Code Style
- TypeScript with strict mode enabled across all projects
- Use Zod for runtime type validation and parsing
- Follow functional programming patterns where possible
- Use camelCase for variables/functions, PascalCase for components/types
- Prefer arrow functions with explicit return types
- Handle errors with try/catch and proper logging
- Use React hooks for state management
- Use Next.js app directory pattern for routing
- Follow consistent import ordering: external deps first, then internal
- Use Tailwind CSS for styling components
- Always use brackets for control statements

This project uses ESLint and TypeScript for enforcing code quality standards.