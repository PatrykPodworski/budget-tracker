"use client";

import { ProcessingBundleEvent } from "@/app/api/receipts/[id]/status/processing-bundle-event";
import { ProcessingBundle } from "@/lib/upload/common/processing-bundle";
import { useEffect, useState } from "react";
import { ReceiptListSkeleton } from "./receipt-list-skeleton";
import { BundleReceiptList } from "./receipt-list";

export const ProcessingBundleStatus = ({ id }: ProcessingBundleStatusProps) => {
  const [processingBundle, setProcessingBundle] = useState<ProcessingBundle>();

  useEffect(() => {
    const eventSource = new EventSource(`/api/receipts/${id}/status`);

    eventSource.onmessage = async (event) => {
      const eventData = JSON.parse(event.data) as ProcessingBundleEvent;
      setProcessingBundle(eventData.data);

      if (eventData.isFinished) {
        eventSource.close();
      }
    };

    return () => {
      eventSource.close();
    };
  }, [id]);

  if (!processingBundle) {
    return <ReceiptListSkeleton />;
  }

  const receipts = Object.entries(processingBundle.receipts).map(
    ([id, status]) => ({
      id,
      status: status.status,
    })
  );

  return <BundleReceiptList receipts={receipts} />;
};

type ProcessingBundleStatusProps = {
  id: string;
};
