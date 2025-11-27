import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/shadcn/card";

export const QuickExpenseSkeleton = () => (
  <div className="flex flex-col gap-4 items-center mb-4">
    <Card className="w-full max-w-md">
      <CardHeader className="sm:pb-0">
        <Skeleton className="h-7 w-48" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
    <Skeleton className="h-10 w-full max-w-md mx-2 sm:w-auto" />
  </div>
);

