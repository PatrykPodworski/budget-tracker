"use client";
import { Label } from "@/components/ui/shadcn/label";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/shadcn/toggle-group";
import { Person } from "@/data/people";
import { useDebounce } from "@/lib/utils/use-debounce";
import { PaymentParticipant } from "@budget-tracker/shared/enriched-receipt-data-schema";
import { formatCurrency } from "@/lib/utils";
import { splitAmount } from "@/lib/utils/split-amount";

type PaidByProps = {
  paidBy: PaymentParticipant[];
  total: number;
  people: readonly Person[];
  onChange: (paidBy: PaymentParticipant[]) => Promise<void>;
};

export const PaidBy = ({
  paidBy,
  total,
  people,
  onChange,
}: PaidByProps) => {
  const { isLoading, debounced } = useDebounce(onChange);

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

    debounced(newPaidBy);
  };

  // Use splitAmount to get correctly rounded amounts for display
  const splitResults = splitAmount(total, selectedPersonIds);
  const amountByPersonId = new Map(splitResults.map((r) => [r.id, r.amount]));

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
        disabled={isLoading}
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
