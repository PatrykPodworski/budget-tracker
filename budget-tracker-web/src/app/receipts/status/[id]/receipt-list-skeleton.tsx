import { Loader2 } from "lucide-react";

// TODO: P2 Add better skeleton
export const ReceiptListSkeleton = () => {
  return (
    <div className="flex items-center justify-center min-h-40">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      <span className="ml-2 text-gray-600">Loading receipt data...</span>
    </div>
  );
};
