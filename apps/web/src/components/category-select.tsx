"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { categories } from "@/data/categories";

// TODO: P1 Fix jumping
export const CategorySelect = ({
  onValueChange,
  value,
  disabled,
  className,
  id,
}: CategorySelectProps) => (
  <Select onValueChange={onValueChange} value={value} disabled={disabled}>
    <SelectTrigger className={className} id={id}>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {categories.map((category) => (
        <SelectItem value={category} key={category}>
          {category}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

type CategorySelectProps = {
  onValueChange: (value: string) => void;
  value: string;
  disabled?: boolean;
  className?: string;
  id?: string;
};
