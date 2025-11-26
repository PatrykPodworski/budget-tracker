import Link from "next/link";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { PlusCircleIcon, ReceiptIcon } from "lucide-react";

export const AddNewButtons = () => (
  <div className="grid grid-cols-2 gap-2 sm:gap-4">
    <Link href="/quick-add">
      <Card className="hover:bg-green-50 transition-colors duration-300 ease-in-out h-full">
        <CardContent className="h-24 flex gap-2 items-center justify-center text-muted-foreground">
          <PlusCircleIcon size={24} />
          <p className="text-lg sm:text-xl">Add expense</p>
        </CardContent>
      </Card>
    </Link>
    <Link href="/receipts/add">
      <Card className="hover:bg-green-50 transition-colors duration-300 ease-in-out h-full">
        <CardContent className="h-24 flex gap-2 items-center justify-center text-muted-foreground">
          <ReceiptIcon size={24} />
          <p className="text-lg sm:text-xl">Add receipt</p>
        </CardContent>
      </Card>
    </Link>
  </div>
);
