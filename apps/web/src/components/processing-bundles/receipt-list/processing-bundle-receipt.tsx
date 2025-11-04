import { Button } from "@/components/ui/shadcn/button";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import {
  ProcessingStatus,
  isFinishedStatus,
} from "@budget-tracker/shared/processing-steps";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { ProgressStepper } from "../progress-stepper";

// TODO: P2: Add merchant name and total when available
// TODO: P2: Handle error state
export const ProgressBundleReceipt = ({
  id,
  status,
}: ProgressBundleReceiptProps) => {
  const router = useRouter();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between sm:pb-0 pb-0">
        <CardTitle className="">Receipt {id.substring(0, 8)}...</CardTitle>
        <Button
          onClick={() => router.push(`/receipts/${id}`)}
          size="sm"
          variant="ghost"
          disabled={!isFinishedStatus(status)}
        >
          View Receipt <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <ProgressStepper status={status} />
      </CardContent>
    </Card>
  );
};

export type ProgressBundleReceiptProps = {
  status: ProcessingStatus;
  id: string;
};
