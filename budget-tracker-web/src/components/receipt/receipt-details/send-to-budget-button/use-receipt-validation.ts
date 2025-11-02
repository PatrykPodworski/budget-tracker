"use client";

import { useState, useEffect, useTransition } from "react";
import {
  validateReceipt,
  ValidationResult,
} from "@/lib/google-spreadsheet/validate-receipt";
import { getColumnToWrite } from "@/lib/google-spreadsheet/utils/get-column-to-write";
import { getRowToWrite } from "@/lib/google-spreadsheet/utils/get-row-to-write";

/**
 * Custom hook to handle receipt validation logic
 * @param props Required properties for validation
 * @returns Validation state and functions
 */
export const useReceiptValidation = ({
  receiptId,
  transactionDate,
  isSentToBudget,
}: UseReceiptValidationProps) => {
  const [isValidating, startValidation] = useTransition();
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);

  // Run validation when component mounts or transaction date changes
  useEffect(() => {
    // Skip validation if receipt is already sent
    if (!transactionDate || isSentToBudget) {
      return;
    }

    const expenseCellInfo = {
      column: getColumnToWrite(transactionDate),
      row: getRowToWrite(),
    };

    startValidation(async () => {
      try {
        const result = await validateReceipt({
          receiptId,
          transactionDate,
          expenseCellInfo,
        });

        setValidationResult(result);
      } catch (error) {
        console.error("Error validating receipt:", error);
        setValidationResult({
          isValid: false,
          message: `Error validating receipt: ${
            error instanceof Error ? error.message : String(error)
          }`,
        });
      }
    });
  }, [receiptId, transactionDate, isSentToBudget]);

  return {
    isValidating,
    validationResult,
  };
};

type UseReceiptValidationProps = {
  receiptId: string;
  transactionDate?: Date;
  isSentToBudget: boolean;
};
