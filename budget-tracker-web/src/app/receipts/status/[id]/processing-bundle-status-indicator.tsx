"use client";

import { ProcessingBundleEvent } from "@/app/api/receipts/[id]/status/route";
import { ProcessingBundle } from "@/lib/upload/common/processing-bundle";
import { useEffect, useState } from "react";

export const ProcessingBundleStatusIndicator = ({
  id,
}: ProcessingBundleStatusIndicatorProps) => {
  const [processingBundle, setProcessingBundle] = useState<ProcessingBundle>();

  useEffect(() => {
    const eventSource = new EventSource(`/api/receipts/${id}/status`);

    eventSource.onmessage = async (event) => {
      const eventData = JSON.parse(event.data) as ProcessingBundleEvent;
      const data = eventData.data;
      console.log(data);
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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Processing Bundle Status</h1>
      <pre>{JSON.stringify(processingBundle, null, 2)}</pre>
    </div>
  );
};

type ProcessingBundleStatusIndicatorProps = {
  id: string;
};
