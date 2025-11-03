"use client";

import { useRouter } from "next/navigation";
import { useRef, useEffect } from "react";
import { ProcessingBundle } from "@budget-tracker/shared/processing-bundle";
import { ProcessingStatus } from "@budget-tracker/shared/processing-steps";

/**
 * Custom hook that redirects to the processed receipt page when a processing bundle's receipt status changes to "enriched".
 *
 * The hook monitors a single receipt in a processing bundle. If the receipt's status changes from its initial state
 * to "enriched", the user is automatically redirected to the receipt detail page.
 *
 * @param {ProcessingBundle | undefined} processingBundle - The processing bundle containing receipts to monitor
 * @returns {void}
 *
 * @remarks
 * - Only works with processing bundles containing exactly one receipt
 * - Will not redirect if the receipt's initial status is already "enriched"
 */
export const useRedirectToProcessedReceipt = (
  processingBundle: ProcessingBundle | undefined
) => {
  const router = useRouter();
  const initialStatusRef = useRef<ProcessingStatus | null>(null);

  useEffect(() => {
    if (!processingBundle) {
      return;
    }

    const receipts = processingBundle.receipts;
    const receiptIds = Object.keys(processingBundle.receipts);

    if (receiptIds.length !== 1) {
      return;
    }

    const receiptId = receiptIds[0];
    const receipt = receipts[receiptId];
    const currentStatus = receipt.status;
    initialStatusRef.current ??= currentStatus;

    if (
      currentStatus === "enriched" &&
      currentStatus !== initialStatusRef.current
    ) {
      router.push(`/receipts/${receiptId}`);
    }
  }, [processingBundle, router]);
};
