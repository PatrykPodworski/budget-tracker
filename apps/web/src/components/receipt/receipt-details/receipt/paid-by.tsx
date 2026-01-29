"use client";
import { useFormContext, useWatch } from "react-hook-form";
import { Label } from "@/components/ui/shadcn/label";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/shadcn/toggle-group";
import { Person } from "@/data/people";
import type { QuickExpenseAmountFormData } from "@/lib/quick-expense/quick-expense-amount-form-schema";
import { convertToBaseCurrency } from "@budget-tracker/shared/currency";
import { formatCurrency } from "@/lib/utils";
import { splitAmount } from "@/lib/utils/split-amount";

type PaidByProps = {
  people: readonly Person[];
};

export const PaidBy = ({ people }: PaidByProps) => {
  const { control, setValue } = useFormContext<QuickExpenseAmountFormData>();

  const paidBy = useWatch({ control, name: "paidBy" });
  const total = useWatch({ control, name: "total" });
  const currency = useWatch({ control, name: "currency" });

  const selectedPersonIds = paidBy.map((p) => p.personId);

  const handleValueChange = (selectedIds: string[]) => {
    if (selectedIds.length === 0) {
      return;
    }

    const sharePercentage = 100 / selectedIds.length;
    const newPaidBy = selectedIds.map((personId) => ({
      personId,
      sharePercentage,
    }));

    setValue("paidBy", newPaidBy, { shouldDirty: true });
  };

  // TODO: P1 Remove default currency after currency is added to receipt form
  const totalInBaseCurrency = convertToBaseCurrency(total, currency ?? 'PLN')
  const amounts = splitAmount(totalInBaseCurrency, selectedPersonIds.length);
  const amountByPersonId = new Map(
    selectedPersonIds.map((id, index) => [id, amounts[index]])
  );

  const peopleWithAmount = people.map((person) => ({
    id: person.id,
    name: person.name,
    amount: formatCurrency(amountByPersonId.get(person.id) ?? 0),
  }));

  return (
    <div className="w-full sm:w-auto md:w-full sm:max-w-60">
      <Label>Paid By</Label>
      <ToggleGroup
        type="multiple"
        value={selectedPersonIds}
        onValueChange={handleValueChange}
        className="justify-start"
      >
        {peopleWithAmount.map((person) => (
          <ToggleGroupItem
            key={person.id}
            value={person.id}
            className="whitespace-nowrap font-normal"
          >
            {person.name} ({person.amount})
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};
