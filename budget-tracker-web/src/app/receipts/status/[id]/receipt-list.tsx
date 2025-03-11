import { Button } from "@/components/ui/shadcn/button";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight } from "lucide-react";
import {
  PROCESSING_STEPS,
  PROCESSING_STATUS_UPLOADED,
  PROCESSING_STATUS_READ,
  getStepIndex,
  ProcessingStatus,
  isFinishedStatus,
} from "@/lib/processing-bundle/common/processing-steps";

// TODO: P0 Improve UI
export const BundleReceiptList = ({ receipts }: BundleReceiptListProps) => {
  const router = useRouter();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold">Receipt Processing Status</h1>
      <div className="grid gap-6">
        {receipts.map((x) => (
          <div key={x.id} className="border rounded-lg p-4 shadow-sm bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">
                Receipt {x.id.substring(0, 8)}...
              </h2>
            </div>
            <div className="relative mb-6">
              <div className="flex items-center justify-between mb-2">
                {PROCESSING_STEPS.map((step, index) => (
                  <div key={step} className="flex flex-col items-center z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-1
                            ${
                              getStepIndex(x.status) >= index
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                    >
                      {getStepIndex(x.status) >= index ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : getStepIndex(x.status) === index - 1 ? (
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
                    x.status === PROCESSING_STATUS_UPLOADED
                      ? "0%"
                      : x.status === PROCESSING_STATUS_READ
                      ? "50%"
                      : "100%",
                }}
              ></div>
            </div>

            {isFinishedStatus(x.status) && (
              <div className="flex justify-end">
                <Button
                  onClick={() => router.push(`/receipts/${x.id}`)}
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

type BundleReceiptListProps = {
  receipts: {
    id: string;
    status: ProcessingStatus;
  }[];
};
