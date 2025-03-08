"use client";

import { ProcessingBundleEvent } from "@/app/api/receipts/[id]/status/route";
import { ProcessingBundle } from "@/lib/upload/common/processing-bundle";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/shadcn/button";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import {
  PROCESSING_FINISHED_STATUS,
  PROCESSING_STATUS_ERROR,
  PROCESSING_STEPS,
  PROCESSING_STATUS_UPLOADED,
  PROCESSING_STATUS_READ,
} from "@/lib/upload/common/processing-steps";

export const ProcessingBundleStatusIndicator = ({
  id,
}: ProcessingBundleStatusIndicatorProps) => {
  const [processingBundle, setProcessingBundle] = useState<ProcessingBundle>();
  const router = useRouter();

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

  // TODO: P-1 Clean up this code
  if (!processingBundle) {
    // TODO: P-2 Add skeleton loader
    return (
      <div className="flex items-center justify-center min-h-40">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Loading receipt data...</span>
      </div>
    );
  }

  const receipts = Object.entries(processingBundle.receipts);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold">Receipt Processing Status</h1>
      <div className="grid gap-6">
        {receipts.map(([receiptId, receipt]) => (
          <div
            key={receiptId}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">
                Receipt {receiptId.substring(0, 8)}...
              </h2>
            </div>
            <div className="relative mb-6">
              <div className="flex items-center justify-between mb-2">
                {PROCESSING_STEPS.map((step, index) => (
                  <div key={step} className="flex flex-col items-center z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-1
                          ${
                            PROCESSING_STEPS.indexOf(receipt.status) >= index
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                    >
                      {PROCESSING_STEPS.indexOf(receipt.status) >= index ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : PROCESSING_STEPS.indexOf(receipt.status) ===
                        index - 1 ? (
                        <div className="h-3 w-3 bg-white rounded-full animate-pulse" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className="text-xs capitalize">{step}</span>
                  </div>
                ))}
              </div>
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-0"></div>
              <div
                className="absolute top-4 left-0 h-0.5 bg-green-500 -z-0 transition-all duration-500"
                style={{
                  width:
                    receipt.status === PROCESSING_STATUS_UPLOADED
                      ? "0%"
                      : receipt.status === PROCESSING_STATUS_READ
                      ? "50%"
                      : "100%",
                }}
              ></div>
            </div>

            {receipt.status === PROCESSING_FINISHED_STATUS && (
              <div className="flex justify-end">
                <Button
                  onClick={() => router.push(`/receipts/${receiptId}`)}
                  className="flex items-center"
                >
                  View Receipt <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

type ProcessingBundleStatusIndicatorProps = {
  id: string;
};
