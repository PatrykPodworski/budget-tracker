"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useFormContext, useFormState } from "react-hook-form";
import { EnrichedReceiptData } from "@budget-tracker/shared/enriched-receipt-data-schema";
import { saveReceipt } from "@/lib/receipt-data/update";
import { writeReceipt } from "@/lib/google-spreadsheet/write-receipt";
import { validateReceipt } from "@/lib/google-spreadsheet/validate-receipt";
import { getColumnToWrite } from "@/lib/google-spreadsheet/utils/get-column-to-write";
import { getRowToWrite } from "@/lib/google-spreadsheet/utils/get-row-to-write";
import { LoadingButton } from "@/components/ui/loading-button";
import { cn } from "@/lib/utils";
import { ReceiptFormData } from "@/lib/receipt-data/receipt-form-schema";

export type SaveMessage = {
  type: "success" | "error" | "warning";
  text: string;
};

export const ReceiptSaveButtons = ({
  receipt,
  saveMessage,
  setSaveMessage,
  setIsSentToBudget,
}: ReceiptSaveButtonsProps) => {
  const router = useRouter();
  const [isSaving, startSaving] = useTransition();

  const { control, reset, getValues } = useFormContext<ReceiptFormData>();
  const { isDirty, isValid } = useFormState({ control });

  const handleSave = () => {
    if (!isDirty || !isValid) {
      return;
    }

    const formData = getValues();
    setSaveMessage(null);
    startSaving(async () => {
      try {
        await saveReceipt(receipt.id, receipt.userId, {
          merchantName: formData.merchantName,
          transactionDate: formData.transactionDate,
          total: formData.total,
          items: formData.items,
          paidBy: formData.paidBy,
        });
        // Reset form with current values to mark as clean
        reset(formData);
        router.refresh();
        setSaveMessage({ type: "success", text: "Receipt saved" });
      } catch (error) {
        console.error("Error saving receipt:", error);
        setSaveMessage({ type: "error", text: "Error saving receipt" });
      }
    });
  };

  const handleSaveAndSend = () => {
    if (!isValid) {
      return;
    }

    const formData = getValues();

    if (!formData.transactionDate) {
      setSaveMessage({
        type: "error",
        text: "Transaction date is required to send to budget",
      });
      return;
    }

    setSaveMessage(null);
    startSaving(async () => {
      try {
        // Always save first
        await saveReceipt(receipt.id, receipt.userId, {
          merchantName: formData.merchantName,
          transactionDate: formData.transactionDate,
          total: formData.total,
          items: formData.items,
          paidBy: formData.paidBy,
        });

        // Validate before sending
        const expenseCellInfo = {
          column: getColumnToWrite(formData.transactionDate!),
          row: getRowToWrite(),
        };

        const validationResult = await validateReceipt({
          receiptId: receipt.id,
          transactionDate: formData.transactionDate!,
          expenseCellInfo,
        });

        if (!validationResult.isValid) {
          // Reset form with current values to mark as clean
          reset(formData);
          setSaveMessage({
            type: "warning",
            text: `Receipt saved but not sent: ${validationResult.message}`,
          });
          router.refresh();
          return;
        }

        // Send to budget
        await writeReceipt({
          receiptId: receipt.id,
          total: formData.total,
          transactionDate: formData.transactionDate!,
          merchantName: formData.merchantName,
          items: formData.items,
          userId: receipt.userId,
          paidBy: formData.paidBy,
        });

        // Reset form with current values to mark as clean
        reset(formData);
        setIsSentToBudget(true);
        router.refresh();
        setSaveMessage({
          type: "success",
          text: "Receipt saved and sent to budget",
        });
      } catch (error) {
        console.error("Error saving and sending receipt:", error);
        setSaveMessage({
          type: "error",
          text: "Error saving and sending receipt",
        });
      }
    });
  };

  return (
    <>
      {saveMessage && (
        <div
          className={cn(
            "text-sm mt-2",
            saveMessage.type === "success" && "text-green-600",
            saveMessage.type === "error" && "text-red-500",
            saveMessage.type === "warning" && "text-yellow-600"
          )}
        >
          {saveMessage.text}
        </div>
      )}
      <div className="flex gap-2 mt-4">
        <LoadingButton
          onClick={handleSave}
          loading={isSaving}
          disabled={!isDirty || !isValid || isSaving}
          variant="outline"
          className="flex-1"
        >
          Save
        </LoadingButton>
        <LoadingButton
          onClick={handleSaveAndSend}
          loading={isSaving}
          disabled={!isValid || isSaving || receipt.isSentToBudget}
          className="flex-1"
        >
          Save and Send
        </LoadingButton>
      </div>
      {receipt.isSentToBudget && (
        <div className="text-green-600 text-sm mt-2">
          Receipt has been sent to budget
        </div>
      )}
    </>
  );
};

type ReceiptSaveButtonsProps = {
  receipt: EnrichedReceiptData;
  saveMessage: SaveMessage | null;
  setSaveMessage: (message: SaveMessage | null) => void;
  setIsSentToBudget: (value: boolean) => void;
};
