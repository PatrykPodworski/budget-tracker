"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { categories } from "../app/categories";

export const CategorySelect = ({
  onValueChange,
  defaultValue,
}: CategorySelectProps) => (
  <Select onValueChange={onValueChange} defaultValue={defaultValue}>
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
  defaultValue: string;
};
