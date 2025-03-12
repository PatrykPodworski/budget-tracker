import { Button } from "@/components/ui/shadcn/button";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import {
  ProcessingStatus,
  isFinishedStatus,
} from "@/lib/processing-bundle/common/processing-steps";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { ProgressStepper } from "./progress-stepper";

// TODO: P2: Add merchant name and total when available
export const ProgressBundleReceipt = ({
  id,
  status,
}: ProgressBundleReceiptProps) => {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receipt {id.substring(0, 8)}...</CardTitle>
      </CardHeader>
      <CardContent>
        <ProgressStepper status={status} />

        {isFinishedStatus(status) && (
          <div className="flex justify-end">
            <Button
              onClick={() => router.push(`/receipts/${id}`)}
              className="flex items-center"
            >
              View Receipt <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export type ProgressBundleReceiptProps = {
  status: ProcessingStatus;
  id: string;
};
