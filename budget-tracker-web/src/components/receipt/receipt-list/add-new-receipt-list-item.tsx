import Link from "next/link";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { PlusCircleIcon } from "lucide-react";

export const AddNewReceiptListItem = () => (
  <Link href="/receipts/add">
    <Card className="hover:bg-green-50 transition-colors duration-300 ease-in-out">
      <CardContent className="h-24 flex gap-2 items-center justify-center text-muted-foreground">
        <PlusCircleIcon size={24} />
        <p className="text-xl">Click here to add a new receipt</p>
      </CardContent>
    </Card>
  </Link>
);
