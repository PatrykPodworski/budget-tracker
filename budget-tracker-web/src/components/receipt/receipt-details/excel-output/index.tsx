"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { getCategoryCellValues } from "@/lib/google-spreadsheet/get-category-cell-values";
import { ExcelFormula } from "./excel-formula";
import { writeReceipt } from "@/lib/google-spreadsheet/write-receipt";
import { useTransition } from "react";
import { LoadingButton } from "@/components/ui/loading-button";
import { EnrichedItem } from "@/models/enriched-item-schema";
import { useReceiptValidation } from "./use-receipt-validation";

// TODO: P0 Rename
// TODO: P0 Mark receipt as sent in CosmosDB
// TODO: P1 Find potential duplicated receipts (amount, date, merchant name)
export const ExcelOutput = ({
  receiptId,
  items,
  merchantName,
  total,
  transactionDate,
}: ExcelOutputProps) => {
  const [isSending, startSending] = useTransition();
  const { isValidating, validationResult } = useReceiptValidation({
    receiptId,
    transactionDate,
  });

  const categoryCellValues = getCategoryCellValues(items);

  const handleClick = () => {
    if (!transactionDate) {
      return;
    }

    startSending(async () => {
      try {
        await writeReceipt({
          receiptId,
          total,
          transactionDate,
          merchantName,
          items,
        });
      } catch (error) {
        console.error("Error writing receipt to spreadsheet:", error);
      }
    });
  };

  // Button should be disabled if:
  // 1. No transaction date
  // 2. Currently validating
  // 3. Validation completed and failed
  const isButtonDisabled =
    !transactionDate ||
    isValidating ||
    (!!validationResult && !validationResult.isValid);

  const getButtonTooltip = () => {
    if (!transactionDate) {
      return "Transaction date is required";
    }
    if (validationResult && !validationResult.isValid) {
      return validationResult.message || "Receipt validation failed";
    }
    return "";
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Excel Output</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {Object.entries(categoryCellValues).map(
          ([category, { formula }], index) => (
            <ExcelFormula category={category} key={index} formula={formula} />
          )
        )}
        {validationResult && !validationResult.isValid && (
          <div className="text-red-500 text-sm">
            {validationResult.message || "Receipt validation failed"}
          </div>
        )}
        <LoadingButton
          className="self-center"
          onClick={handleClick}
          loading={isValidating || isSending}
          disabled={isButtonDisabled}
          title={getButtonTooltip()}
        >
          Send to budget
        </LoadingButton>
      </CardContent>
    </Card>
  );
};

type ExcelOutputProps = {
  receiptId: string;
  total: number;
  transactionDate?: Date;
  merchantName: string | undefined;
  items: EnrichedItem[];
};
