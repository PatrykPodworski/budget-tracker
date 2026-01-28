"use client";
import { useFormContext, useWatch } from "react-hook-form";
import { Label } from "@/components/ui/shadcn/label";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/shadcn/toggle-group";
import { Person } from "@/data/people";
import { PaymentParticipant } from "@budget-tracker/shared/enriched-receipt-data-schema";
import { formatCurrency } from "@/lib/utils";

type FormWithPaidBy = { paidBy: PaymentParticipant[]; total: number };

type PaidByProps = {
  people: readonly Person[];
};

export const PaidBy = ({ people }: PaidByProps) => {
  const { control, setValue } = useFormContext<FormWithPaidBy>();

  const paidBy = useWatch({ control, name: "paidBy" });
  const total = useWatch({ control, name: "total" });

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

  const peopleWithAmount = people.map((person) => ({
    id: person.id,
    name: person.name,
    amount: getPersonAmount(person.id, paidBy, total),
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
