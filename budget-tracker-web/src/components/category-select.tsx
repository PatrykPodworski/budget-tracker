"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { categories } from "@/data/categories";

export const CategorySelect = ({
  onValueChange,
  value,
}: CategorySelectProps) => (
  <Select onValueChange={onValueChange} value={value}>
    <SelectTrigger className="w-fit">
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
};
