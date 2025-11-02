"use server";

import { CellInfo } from "./cell-write";
import { readCell } from "./read-cell";
import { getSheetTitleToWrite } from "./utils/get-sheet-title-to-write";
import { GoogleSpreadsheetCell } from "google-spreadsheet";

export type ValidationResult = {
  isValid: boolean;
  message?: string;
};

type ValidateReceiptParams = {
  receiptId: string;
  transactionDate: Date;
  expenseCellInfo: CellInfo;
};

/**
 * Validates if a receipt has already been recorded in the spreadsheet
 * @param params Parameters for receipt validation
 * @returns Validation result with status and message
 */
export const validateReceipt = async (
  params: ValidateReceiptParams
): Promise<ValidationResult> => {
  const { receiptId, transactionDate, expenseCellInfo } = params;
  const sheetTitle = getSheetTitleToWrite(transactionDate);

  try {
    const cell = await readCell(sheetTitle, expenseCellInfo);

    if (!cell) {
      return {
        isValid: false,
        message: "Failed to read cell data for validation",
      };
    }

    return validateCellForReceiptId(cell, receiptId);
  } catch (error) {
    console.error("Error validating receipt:", error);
    return {
      isValid: false,
      message: `Validation error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
};

/**
 * Validates a cell to check if it already contains a specific receipt ID
 * @param cell The spreadsheet cell to validate
 * @param receiptId The receipt ID to check for
 * @returns Validation result with status and message
 */
const validateCellForReceiptId = (
  cell: GoogleSpreadsheetCell,
  receiptId: string
): ValidationResult => {
  const hasNoNote = !cell.note;
  const noteDoesNotContainReceiptId = cell.note
    ? !cell.note.includes(receiptId)
    : true;

  if (hasNoNote || noteDoesNotContainReceiptId) {
    return {
      isValid: true,
    };
  }

  return {
    isValid: false,
    message: `Cell already contains value: ${receiptId}`,
  };
};
