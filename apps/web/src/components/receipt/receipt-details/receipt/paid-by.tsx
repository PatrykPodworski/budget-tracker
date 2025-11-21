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
import { EnrichedItem } from "@budget-tracker/shared/enriched-item-schema";
import { calculateTotal } from "./calculate-total";

type PaidByProps = {
  paidBy: PaymentParticipant[];
  items: EnrichedItem[];
  people: readonly Person[];
  onChange: (paidBy: PaymentParticipant[]) => Promise<void>;
};

export const PaidBy = ({
  paidBy,
  items,
  people,
  onChange,
}: PaidByProps) => {
  const { isLoading, debounced } = useDebounce(onChange);

  const calculatedTotal = calculateTotal(items);

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

  const peopleWithAmount = people.map((person) => ({
    id: person.id,
    name: person.name,
    amount: getPersonAmount(person.id, paidBy, calculatedTotal),
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

const getPersonAmount = (
  personId: string,
  paidBy: PaymentParticipant[],
  total: number
) => {
  const participant = paidBy.find((p) => p.personId === personId);
  if (!participant) {
    return formatCurrency(0);
  }
  const amount = (total * participant.sharePercentage) / 100;
  return formatCurrency(amount);
};
