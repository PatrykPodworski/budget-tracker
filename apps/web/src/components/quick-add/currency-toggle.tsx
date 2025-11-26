"use client";

import { Label } from "@/components/ui/shadcn/label";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/shadcn/toggle-group";
import {
  currencies,
  Currency,
  isCurrency,
} from "@budget-tracker/shared/currency";

export const CurrencyToggle = ({
  value,
  onChange,
  disabled,
}: CurrencyToggleProps) => {
  const handleValueChange = (newValue: string) => {
    if (isCurrency(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <Label>Currency</Label>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled}
        className="justify-start"
      >
        {currencies.map((currency) => (
          <ToggleGroupItem
            key={currency}
            value={currency}
            className="whitespace-nowrap font-normal"
          >
            {currency}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

type CurrencyToggleProps = {
  value: Currency;
  onChange: (currency: Currency) => void;
  disabled?: boolean;
};
