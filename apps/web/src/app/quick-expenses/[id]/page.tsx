import { QuickExpenseForm } from "@/components/quick-expense/quick-expense-form";
import { QuickExpenseSkeleton } from "@/components/quick-expense/quick-expense-details/quick-expense-skeleton";
import { Button } from "@/components/ui/shadcn/button";
import { getQuickExpense } from "@/lib/quick-expense/get-quick-expense";
import { people } from "@/data/people";
import { env } from "@/env";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const QuickExpensePageContent = async ({ id }: { id: string }) => {
  const quickExpense = await getQuickExpense(id);

  if (!quickExpense) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4 items-center mb-4">
      <QuickExpenseForm
        quickExpense={quickExpense}
        people={people}
        defaultUserId={env.TEMP_USER_ID}
      />
      <Button
        asChild
        variant="outline"
        className="self-stretch mx-2 sm:self-center"
      >
        <Link href="/">Back</Link>
      </Button>
    </div>
  );
};

const QuickExpensePage = async ({ params }: QuickExpensePageProps) => {
  const { id } = await params;

  return (
    <Suspense fallback={<QuickExpenseSkeleton />}>
      <QuickExpensePageContent id={id} />
    </Suspense>
  );
};

type QuickExpensePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default QuickExpensePage;
