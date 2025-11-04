"use client";

import { useTransition } from "react";
import { LoadingButton } from "@/components/ui/loading-button";
import { writeReceipt } from "@/lib/google-spreadsheet/write-receipt";
import { useReceiptValidation } from "./use-receipt-validation";
import { EnrichedItem } from "@budget-tracker/shared/enriched-item-schema";

// TODO: P1 Make the loading button always the same width
export const SendToBudgetButton = ({
  receipt: { id, items, merchantName, total, transactionDate, userId, isSentToBudget },
}: SendToBudgetButtonProps) => {
  const [isSending, startSending] = useTransition();
  const { isValidating, validationResult } = useReceiptValidation({
    receiptId: id,
    transactionDate,
    isSentToBudget,
  });

  const handleClick = () => {
    if (!transactionDate) {
      return;
    }
    startSending(async () => {
      try {
        await writeReceipt({
          receiptId: id,
          total,
          transactionDate,
          merchantName,
          items,
          userId,
        });
      } catch (error) {
        console.error("Error writing receipt to spreadsheet:", error);
      }
    });
  };

  const isButtonDisabled =
    !transactionDate ||
    isValidating ||
    isSentToBudget ||
    (!!validationResult && !validationResult.isValid);

  const getButtonTooltip = () => {
    if (!transactionDate) {
      return "Transaction date is required";
    }
    if (isSentToBudget) {
      return "Receipt has already been sent to budget";
    }
    if (validationResult && !validationResult.isValid) {
      return validationResult.message || "Receipt validation failed";
    }
    return "";
  };

  return (
    <>
      {validationResult && !validationResult.isValid && (
        <div className="text-red-500 text-sm">
          {validationResult.message || "Receipt validation failed"}
        </div>
      )}
      {isSentToBudget && (
        <div className="text-green-600 text-sm">
          Receipt has been sent to budget
        </div>
      )}
      <LoadingButton
        onClick={handleClick}
        loading={isValidating || isSending}
        disabled={isButtonDisabled}
        title={getButtonTooltip()}
        className="grow sm:grow-0"
      >
        Send to budget
      </LoadingButton>
    </>
  );
};

type SendToBudgetButtonProps = {
  receipt: {
    id: string;
    total: number;
    transactionDate?: Date;
    merchantName?: string;
    items: EnrichedItem[];
    userId: string;
    isSentToBudget: boolean;
  };
};
