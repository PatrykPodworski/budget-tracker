"use client";

import { useEffect, useState } from "react";
import { BundleReceiptList } from "@/components/processing-bundles/receipt-list";
import { ReceiptListSkeleton } from "@/components/processing-bundles/receipt-list/receipt-list-skeleton";
import { ProcessingBundleEvent } from "@/lib/processing-bundle/common/processing-bundle-event";
import { ProcessingBundle } from "@/lib/processing-bundle/common/processing-bundle";

export const ProcessingBundleStatus = ({ id }: ProcessingBundleStatusProps) => {
  const [processingBundle, setProcessingBundle] = useState<ProcessingBundle>();

  useEffect(() => {
    const eventSource = new EventSource(`/api/processing/${id}`);

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
