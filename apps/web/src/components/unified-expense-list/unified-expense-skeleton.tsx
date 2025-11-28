import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { Card, CardContent } from "@/components/ui/shadcn/card";

export const UnifiedExpenseSkeleton = () => (
  <Card>
    <CardContent>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <Skeleton className="h-5 w-5 rounded-full shrink-0" />
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>
    </CardContent>
  </Card>
);

export const UnifiedExpenseListSkeleton = () => (
  <div className="flex flex-col gap-4">
    {Array.from({ length: 10 }).map((_, i) => (
      <UnifiedExpenseSkeleton key={i} />
    ))}
  </div>
);
