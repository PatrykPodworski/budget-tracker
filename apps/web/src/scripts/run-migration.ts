#!/usr/bin/env node
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });
import { addIsSentToBudget } from "./add-is-sent-to-budget";

/**
 * Command-line script to run the CosmosDB migration
 */
// TODO: P1: Make it a separate tools project
async function runMigration() {
  console.log("Starting migration script...");

  try {
    await addIsSentToBudget();
    process.exit(0);
  } catch (error) {
    console.error(
      "Migration failed:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

// Check if this file is being run directly
if (require.main === module) {
  runMigration();
}
