import { NextResponse } from "next/server";
import { getLatestReceipts } from "@/lib/receipt-data/get-latest-receipts";
import { getLatestQuickExpenses } from "@/lib/quick-expense/get-latest";
import { mergeAndSortExpenses } from "@budget-tracker/shared/unified-expense-schema";

export const GET = async () => {
  try {
    const [receipts, quickExpenses] = await Promise.all([
      getLatestReceipts(),
      getLatestQuickExpenses(),
    ]);

    const unifiedExpenses = mergeAndSortExpenses(receipts, quickExpenses);

    return NextResponse.json(unifiedExpenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
};
