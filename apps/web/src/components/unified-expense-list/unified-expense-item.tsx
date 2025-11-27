import Link from "next/link";
import { UnifiedExpense } from "@budget-tracker/shared/unified-expense-schema";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/button";
import { Badge } from "@/components/ui/shadcn/badge";
import { ReceiptStatusIcon } from "../receipt/receipt-list/receipt-status-icon";

export const UnifiedExpenseItem = ({ expense }: UnifiedExpenseItemProps) => {
  const isReceipt = expense.type === "receipt";

  const name = isReceipt
    ? expense.data.merchantName || "Untitled Receipt"
    : expense.data.name;

  const amount = isReceipt
    ? formatCurrency(expense.data.total)
    : formatCurrency(expense.data.amount, expense.data.currency);

  const detailsUrl = isReceipt
    ? `/receipts/${expense.data.id}`
    : `/quick-expenses/${expense.data.id}`;

  const transactionDate = expense.data.transactionDate
    ? formatDateTime(expense.data.transactionDate)
    : "No date";

  const data = expense.data;

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <div className="shrink-0">
                <ReceiptStatusIcon isSent={data.isSentToBudget} />
              </div>
              <h3 className="text-lg font-semibold truncate min-w-0">{name}</h3>
            </div>
            {isReceipt ? (
              <p className="text-sm text-muted-foreground mt-1">
                {transactionDate}
              </p>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-muted-foreground">
                  {transactionDate}
                </p>
                <Badge variant="outline" className="text-xs shrink-0">
                  Quick Expense
                </Badge>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className="text-lg font-bold">{amount}</p>
          </div>
          <Link href={detailsUrl} passHref>
            <Button variant="outline">View Details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

type UnifiedExpenseItemProps = {
  expense: UnifiedExpense;
};
