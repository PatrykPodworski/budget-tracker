import { QuickExpenseForm } from "@/components/quick-expense/quick-expense-form";
import { Button } from "@/components/ui/shadcn/button";
import { people } from "@/data/people";
import { env } from "@/env";
import Link from "next/link";

const QuickAddPage = () => {
  return (
    <div className="flex flex-col gap-4 items-center mb-4">
      <QuickExpenseForm people={people} defaultUserId={env.TEMP_USER_ID} />
      <Button
        asChild
        variant="outline"
        className="self-stretch mx-2 sm:self-center sm:w-full sm:max-w-md"
      >
        <Link href="/">Back</Link>
      </Button>
    </div>
  );
};

export default QuickAddPage;
